<?php


namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Coupon;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\OrderedFile;
use Marvel\Database\Models\OrderWalletPoint;
use Marvel\Database\Models\Wallet;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\User;
use Marvel\Database\Models\Variation;
use Marvel\Enums\CouponType;
use Marvel\Enums\OrderStatus;
use Marvel\Enums\Permission;
use Marvel\Enums\ProductType;
use Marvel\Enums\PaymentGatewayType;
use Marvel\Enums\PaymentStatus;
use Marvel\Events\OrderCreated;
use Marvel\Events\OrderProcessed;
use Marvel\Events\OrderReceived;
use Marvel\Exceptions\MarvelBadRequestException;
use Marvel\Traits\CalculatePaymentTrait;
use Marvel\Traits\OrderManagementTrait;
use Marvel\Traits\OrderStatusManagerWithPaymentTrait;
use Marvel\Traits\PaymentTrait;
use Marvel\Traits\WalletsTrait;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class OrderRepository extends BaseRepository
{
    use WalletsTrait,
        CalculatePaymentTrait,
        OrderManagementTrait,
        OrderStatusManagerWithPaymentTrait,
        PaymentTrait;
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'tracking_number' => 'like',
        'shop_id',
        'language',
    ];
    /**
     * @var string[]
     */
    protected array $dataArray = [
        'tracking_number',
        'customer_id',
        'shop_id',
        'language',
        'order_status',
        'payment_status',
        'amount',
        'sales_tax',
        'paid_total',
        'total',
        'delivery_time',
        'payment_gateway',
        'altered_payment_gateway',
        'discount',
        'coupon_id',
        'logistics_provider',
        'billing_address',
        'shipping_address',
        'delivery_fee',
        'customer_contact',
        'customer_name',
        'note',
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
            //
        }
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Order::class;
    }

    /**
     * Store order
     *
     * @param $request
     * @param $settings
     * @return LengthAwarePaginator|JsonResponse|Collection|mixed
     * @throws Exception
     */
    public function storeOrder($request, $settings): mixed
    {
        $request['tracking_number'] = $this->generateTrackingNumber();
        // $request->merge([
        //     'payable'         => $request['paid_total'], // amount to be paid through paymentGateway
        //     'wallet_currency' => 0
        // ]);

        $fullWalletOrCODPayment = $request?->isFullWalletPayment ? PaymentGatewayType::FULL_WALLET_PAYMENT : PaymentGatewayType::CASH_ON_DELIVERY;
        $payment_gateway_type = !empty($request->payment_gateway) ? $request->payment_gateway : $fullWalletOrCODPayment;

        switch ($payment_gateway_type) {
            case PaymentGatewayType::CASH_ON_DELIVERY:
                $request['order_status'] = OrderStatus::PROCESSING;
                $request['payment_status'] = PaymentStatus::CASH_ON_DELIVERY;
                break;

            case PaymentGatewayType::CASH:
                $request['order_status'] = OrderStatus::PROCESSING;
                $request['payment_status'] = PaymentStatus::CASH;
                break;

                // case PaymentGatewayType::FULL_WALLET_PAYMENT:
                //     $request['order_status'] = OrderStatus::PROCESSING;
                //     $request['payment_status'] = PaymentStatus::WALLET;
                //     break;

            default:
                $request['order_status'] = OrderStatus::PENDING;
                $request['payment_status'] = PaymentStatus::PENDING;
                break;
        }

        $useWalletPoints = isset($request->use_wallet_points) ? $request->use_wallet_points : false;
        if ($request->user() && $request->user()->hasPermissionTo(Permission::SUPER_ADMIN) && isset($request['customer_id'])) {
            $request['customer_id'] =  $request['customer_id'];
        } else {
            $request['customer_id'] = $request->user()->id ?? null;
        }
        try {
            $user = User::findOrFail($request['customer_id']);
            if ($user) {
                $request['customer_name'] = $user->name;
            }
        } catch (Exception $e) {
            $user = null;
        }

        if (!$user) {
            $settings = Settings::getData($request->language);
            if (isset($settings->options['guestCheckout']) && !$settings->options['guestCheckout']) {
                throw new AuthorizationException(NOT_AUTHORIZED);
            }
        }
        $request['amount'] = $this->calculateSubtotal($request['products']);

        if (isset($request->coupon_id)) {
            try {
                $coupon = Coupon::findOrFail($request['coupon_id']);
                $request['discount'] = $this->calculateDiscount($coupon,  $request['amount']);
            } catch (Exception $th) {
                throw $th;
            }
        }

        if (isset($coupon) && $coupon->type === CouponType::FREE_SHIPPING_COUPON) {
            $request['delivery_fee'] = 0;
        } else {
            $request['delivery_fee'] = $request['delivery_fee'];
        }

        $request['paid_total'] = $request['amount'] + $request['sales_tax'] + $request['delivery_fee'] -  $request['discount'];
        $request['total'] = $request['paid_total'];
        if (($useWalletPoints || $request->isFullWalletPayment) && $user) {
            $wallet = $user->wallet;
            $amount = null;
            if (isset($wallet->available_points)) {
                $amount = round($request['paid_total'], 2) - $this->walletPointsToCurrency($wallet->available_points);
            }

            if ($amount !== null && $amount <= 0) {
                $request['order_status'] = OrderStatus::COMPLETED;
                $request['payment_gateway'] = PaymentGatewayType::FULL_WALLET_PAYMENT;
                $request['payment_status'] = PaymentStatus::SUCCESS;
                $order = $this->createOrder($request);
                $this->storeOrderWalletPoint($request['paid_total'], $order->id);
                $this->manageWalletAmount($request['paid_total'], $user->id);
                return $order;
            }
        } else {
            $amount = round($request['paid_total'], 2);
        }

        $order = $this->createOrder($request);

        if (($useWalletPoints || $request->isFullWalletPayment) && $user) {
            $this->storeOrderWalletPoint(round($request['paid_total'], 2) - $amount, $order->id);
            $this->manageWalletAmount(round($request['paid_total'], 2), $user->id);
        }

        $eligible = $this->checkOrderEligibility();
        if (!$eligible) {
            throw new MarvelBadRequestException('COULD_NOT_PROCESS_THE_ORDER_PLEASE_CONTACT_WITH_THE_ADMIN');
        }
        // Create Intent
        if (!in_array($order->payment_gateway, [
            PaymentGatewayType::CASH, PaymentGatewayType::CASH_ON_DELIVERY, PaymentGatewayType::FULL_WALLET_PAYMENT
        ])) {
            $order['payment_intent'] = $this->processPaymentIntent($request, $settings);
        }


        if ($payment_gateway_type === PaymentGatewayType::CASH_ON_DELIVERY || $payment_gateway_type === PaymentGatewayType::CASH) {
            $this->orderStatusManagementOnCOD($order, OrderStatus::PENDING, OrderStatus::PROCESSING);
        } else {
            $this->orderStatusManagementOnPayment($order, OrderStatus::PENDING, PaymentStatus::PENDING);
        }

        event(new OrderProcessed($order));

        return $order;
    }


    /**
     * updateOrder
     *
     * @param  mixed $request
     * @return void
     */
    public function updateOrder($request)
    {
        $order = Order::findOrFail($request->id);
        $user = $request->user();
        if (isset($order->shop_id)) {
            if ($this->hasPermission($user, $order->shop_id)) {
                return $this->changeOrderStatus($order, $request->order_status);
            }
        } else if ($user->hasPermissionTo(Permission::SUPER_ADMIN)) {
            return $this->changeOrderStatus($order, $request->order_status);
        } else {
            throw new AuthorizationException(NOT_AUTHORIZED);
        }
    }

    /**
     * storeOrderWalletPoint
     *
     * @param  mixed $amount
     * @param  mixed $order_id
     * @return void
     */
    public function storeOrderWalletPoint($amount, $order_id)
    {
        if ($amount > 0) {
            OrderWalletPoint::create(['amount' =>  $amount, 'order_id' =>  $order_id]);
        }
    }


    /**
     * manageWalletAmount
     *
     * @param  mixed $total
     * @param  mixed $customer_id
     * @return void
     */
    public function manageWalletAmount($total, $customer_id)
    {
        try {
            $total = $this->currencyToWalletPoints($total);
            $wallet = Wallet::where('customer_id', $customer_id)->first();
            $available_points = $wallet->available_points - $total >= 0 ? $wallet->available_points - $total : 0;
            if ($available_points === 0) {
                $spend = $wallet->points_used + $wallet->available_points;
            } else {
                $spend = $wallet->points_used + $total;
            }
            $wallet->available_points = $available_points;
            $wallet->points_used = $spend;
            $wallet->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $request
     * @return array|LengthAwarePaginator|Collection|mixed
     */
    protected function createOrder($request)
    {
        try {
            $orderInput = $request->only($this->dataArray);
            $order = $this->create($orderInput);
            $products = $this->processProducts($request['products'], $request['customer_id'], $order);
            $order->products()->attach($products);
            $this->createChildOrder($order->id, $request);
            //  $this->calculateShopIncome($order);
            $invoiceData = $this->createInvoiceDataForEmail($request, $order);
            $customer = $request->user() ?? null;
            event(new OrderCreated($order, $invoiceData, $customer));
            return $order;
        } catch (Exception $e) {
            throw $e;
        }
    }
    /**
     * This function creates an array of data for an email invoice, including order information,
     * settings, translated text, and URL.
     * 
     * @param request This is an HTTP request object that contains information about the current
     * request being made to the server. It is used to retrieve data from the request, such as the
     * language and whether the text should be displayed right-to-left (RTL).
     * @param order The order object that contains information about the order, such as the customer
     * details, order items, and total amount.
     * 
     * @return array An array containing order data, settings data, translated text, RTL status,
     * language, and a URL.
     */
    public function createInvoiceDataForEmail($request, $order): array
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        $isRTL = $request->is_rtl ?? false;

        $translatedText = $this->formatInvoiceTranslateText($request->invoice_translated_text);
        $settings = Settings::getData($language);
        return [
            'order'           => $order,
            'settings'        => $settings,
            'translated_text' => $translatedText,
            'is_rtl'          => $isRTL,
            'language'        => $language,
            'url' => config('shop.shop_url') . '/orders/' . $order->tracking_number
        ];
    }

    /**
     * calculateShopIncome
     *
     * @param  mixed $parent_order
     * @return void
     */
    protected function calculateShopIncome($parent_order)
    {
        foreach ($parent_order->children as  $order) {
            $balance = Balance::where('shop_id', '=', $order->shop_id)->first();
            $adminCommissionRate = $balance->admin_commission_rate;
            $shop_earnings = ($order->total * (100 - $adminCommissionRate)) / 100;
            $balance->total_earnings = $balance->total_earnings + $shop_earnings;
            $balance->current_balance = $balance->current_balance + $shop_earnings;
            $balance->save();
        }
    }

    /**
     * processProducts
     *
     * @param  mixed $products
     * @param  mixed $customer_id
     * @param  mixed $order
     * @return void
     */
    protected function processProducts($products, $customer_id, $order)
    {
        foreach ($products as $key => $product) {
            if (!isset($product['variation_option_id'])) {
                $product['variation_option_id'] = null;
                $products[$key] = $product;
            }
            try {
                if ($order->parent_id === null) {
                    $productData = Product::with('digital_file')->findOrFail($product['product_id']);

                    // if rental product
                    $isRentalProduct = $productData->is_rental;
                    if ($isRentalProduct) {
                        $this->processRentalProduct($product, $order->id);
                    }


                    if ($productData->product_type === ProductType::SIMPLE) {
                        $this->storeOrderedFile($productData, $product['order_quantity'], $customer_id, $order->tracking_number);
                    } else if ($productData->product_type === ProductType::VARIABLE) {
                        $variation_option = Variation::with('digital_file')->findOrFail($product['variation_option_id']);
                        $this->storeOrderedFile($variation_option, $product['order_quantity'], $customer_id, $order->tracking_number);
                    }
                }
            } catch (Exception $e) {
                throw $e;
            }
        }
        return $products;
    }


    /**
     * storeOrderedFile
     *
     * @param  mixed $item
     * @param  mixed $order_quantity
     * @param  mixed $customer_id
     * @return void
     */
    public function storeOrderedFile($item, $order_quantity, $customer_id, $order_tracking_number)
    {
        if ($item->is_digital) {
            $digital_file = $item->digital_file;
            for ($i = 0; $i < $order_quantity; $i++) {
                OrderedFile::create([
                    'purchase_key'    => Str::random(16),
                    'digital_file_id' => $digital_file->id,
                    'customer_id'     => $customer_id,
                    'tracking_number'  => $order_tracking_number
                ]);
            }
        }
    }

    /**
     * processRentalProduct
     *
     * @param  mixed $product
     * @param  mixed $orderId
     * @return void
     */
    protected function processRentalProduct($product, $orderId)
    {
        $product['from'] = Carbon::parse($product['from']);
        $product['to'] = Carbon::parse($product['to']);
        $product['booking_duration'] = $product['from']->diffAsCarbonInterval($product['to']);
        $product['order_id'] = $orderId;
        $product['language'] = $orderId;
        unset($product['unit_price']);
        unset($product['subtotal']);
        try {
            if ($product['variation_option_id'] === null) {
                $productData = Product::findOrFail($product['product_id']);
                unset($product['variation_option_id']);
                $product['language'] = $productData->language;
                if (TRANSLATION_ENABLED) {
                    $this->processAllTranslatedProducts($productData, $product);
                } else {
                    $productData->availabilities()->create($product);
                }
            } else {
                $variation_option = Variation::findOrFail($product['variation_option_id']);
                unset($product['variation_option_id']);
                if (TRANSLATION_ENABLED) {
                    $this->processAllTranslatedVariations($variation_option, $product);
                } else {
                    $variation_option->availabilities()->create($product);
                }
            }
        } catch (\Throwable $th) {
            throw new ModelNotFoundException(NOT_FOUND);
        }
    }

    /**
     * processAllTranslatedProducts
     *
     * @param  mixed $product
     * @param  mixed $orderedItem
     * @return void
     */
    public function processAllTranslatedProducts($product, $orderedItem)
    {
        $translatedProducts = Product::where('sku', $product->sku)->get();
        foreach ($translatedProducts as $translatedProduct) {
            $orderedItem['language'] = $translatedProduct->language;
            $orderedItem['product_id'] = $translatedProduct->id;
            $translatedProduct->availabilities()->create($orderedItem);
        }
    }

    /**
     * processAllTranslatedVariations
     *
     * @param  mixed $variation
     * @param  mixed $orderedItem
     * @return void
     */
    public function processAllTranslatedVariations($variation, $orderedItem)
    {
        $translatedVariations = Variation::where('sku', $variation->sku)->get();
        foreach ($translatedVariations as $translatedVariation) {
            $orderedItem['language'] = $translatedVariation->language;
            $translatedVariation->availabilities()->create($orderedItem);
        }
    }


    /**
     * createChildOrder
     *
     * @param  mixed $id
     * @param  mixed $request
     * @return void
     * @throws Exception
     */
    public function createChildOrder($id, $request): void
    {
        $products = $request->products;
        $productsByShop = [];
        $language = $request->language ?? DEFAULT_LANGUAGE;

        foreach ($products as $key => $cartProduct) {
            $product = Product::findOrFail($cartProduct['product_id']);
            $productsByShop[$product->shop_id][] = $cartProduct;
        }

        foreach ($productsByShop as $shop_id => $cartProduct) {
            $amount = array_sum(array_column($cartProduct, 'subtotal'));
            $orderInput = [
                'tracking_number'  => $this->generateTrackingNumber(),
                'shop_id'          => $shop_id,
                'order_status'     => $request->order_status,
                'payment_status'   => $request->payment_status,
                'customer_id'      => $request->customer_id,
                'shipping_address' => $request->shipping_address,
                'billing_address'  => $request->billing_address,
                'customer_contact' => $request->customer_contact,
                'customer_name'    => $request->customer_name,
                'delivery_time'    => $request->delivery_time,
                'delivery_fee'     => 0,
                'sales_tax'        => 0,
                'discount'         => 0,
                'parent_id'        => $id,
                'amount'           => $amount,
                'total'            => $amount,
                'paid_total'       => $amount,
                'language'         => $language,
                "payment_gateway"  => $request->payment_gateway,
            ];

            $order = $this->create($orderInput);
            $order->products()->attach($this->processProducts($cartProduct,  $request['customer_id'],  $order));
            event(new OrderReceived($order));
        }
    }

    /**
     * Helper method to generate unique tracking number
     *
     * @return string
     * @throws Exception
     */
    public function generateTrackingNumber(): string
    {
        $today = date('Ymd');
        $trackingNumbers = Order::where('tracking_number', 'like', $today . '%')->pluck('tracking_number');

        do {
            $trackingNumber = $today . random_int(100000, 999999);
        } while ($trackingNumbers->contains($trackingNumber));

        return $trackingNumber;
    }

    public function checkOrderEligibility(): bool
    {
        $settings = Settings::getData();
        $useMustVerifyLicense = isset($settings->options['app_settings']['trust']) ? $settings->options['app_settings']['trust'] : false;
        return $useMustVerifyLicense;
    }
}
