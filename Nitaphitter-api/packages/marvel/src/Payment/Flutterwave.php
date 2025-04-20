<?php

namespace Marvel\Payments;


use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Marvel\Exceptions\MarvelException;
use Marvel\Payments\PaymentInterface;
use Marvel\Enums\OrderStatus;
use Marvel\Database\Models\Order;
use Marvel\Enums\PaymentStatus;
use Marvel\Traits\PaymentTrait;
use Marvel\Payments\Base;
use Razorpay\Api\Errors\SignatureVerificationError;
use KingFlamez\Rave\Facades\Rave as FlutterwaveFacade;
use Marvel\Database\Models\PaymentIntent;

class Flutterwave extends Base implements PaymentInterface
{
    use PaymentTrait;

    public FlutterwaveFacade $flutterwave;

    public function __construct()
    {
        parent::__construct();
        $this->flutterwave = new FlutterwaveFacade(config('shop.flutterwave.secret_key'), config('shop.flutterwave.public_key'));
    }

    public function getIntent($data): array
    {
        try {
            extract($data);
            $reference = FlutterwaveFacade::generateReference();

            // Enter the details of the payment
            $paymentData = [
                'payment_options' => 'card,banktransfer',
                'amount' => number_format($amount, 2),
                'email' => $user_email ?? $order_tracking_number . '@email.com',
                'tx_ref' => $reference,
                'currency' => $this->currency,
                'redirect_url' => route('callback.flutterwave'),
                'meta' => [
                    'order_tracking_number' => $order_tracking_number
                ],
                'customer' => [
                    'email' => $user_email ?? $order_tracking_number . '@email.com',
                ]
            ];

            $order = FlutterwaveFacade::initializePayment($paymentData);

            return [
                'order_tracking_number'   => $order_tracking_number,
                'is_redirect'  => true,
                'payment_id'   => $paymentData['tx_ref'],
                'tx_ref_id'   => $paymentData['tx_ref'],
                'redirect_url' => $order['data']['link'],
            ];
        } catch (Exception $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }

    /**
     *  Flutterwave callback
     *
     * @param  mixed  $request
     * @return void
     */
    public static function callback(Request $request)
    {
        try {
            $tx_ref = $request['tx_ref'];
            if ($request['status'] ==  'cancelled') {
                $tracking_number1 = PaymentIntent::whereJsonContains('payment_intent_info->payment_id', $tx_ref)->first();
                return redirect(config("shop.shop_url") . "/orders/{$tracking_number1->payment_intent_info['order_tracking_number']}/payment");
            }

            $transactionID = $request['transaction_id'];
            $result = FlutterwaveFacade::verifyTransaction($transactionID);
            $tracking_number = $result['data']['meta']['order_tracking_number'];
            PaymentIntent::whereJsonContains('payment_intent_info->payment_id', $tx_ref)->update([
                'payment_intent_info->payment_id' => $transactionID
            ]);

            return redirect(config("shop.shop_url") . "/orders/{$tracking_number}/thank-you");
        } catch (Exception $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }



    public function verify($transaction): mixed
    {

        try {
            $result = FlutterwaveFacade::verifyTransaction($transaction);
            return isset($result['data']['status']) ? $result['data']['status'] : false;
        } catch (Exception $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }

    /**
     * handleWebHooks
     *
     * @param  mixed  $request
     * @return void
     * @throws Throwable
     */
    public function handleWebHooks($request): void
    {
        try {
            $verified = FlutterwaveFacade::verifyWebhook();

            if ($verified && $request->event == 'charge.completed' && $request->data['status'] == 'successful') {
                $verificationData = FlutterwaveFacade::verifyTransaction($request->data['id']);
                if ($verificationData['status'] === 'success') {
                    $this->updatePaymentOrderStatus($request, OrderStatus::PROCESSING, PaymentStatus::SUCCESS);
                }
            }
        } catch (Exception $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }

    /**
     * Update Payment and Order Status
     *
     * @param $request
     * @param $orderStatus
     * @param $paymentStatus
     * @return void
     */
    public function updatePaymentOrderStatus($request, $orderStatus, $paymentStatus): void
    {
        $paymentIntent = PaymentIntent::whereJsonContains('payment_intent_info', ['tx_ref_id' => $request['data']['tx_ref']])->first();
        $trackingId = $paymentIntent->tracking_number;
        $order = Order::where('tracking_number', '=', $trackingId)->first();
        $this->webhookSuccessResponse($order, $orderStatus, $paymentStatus);
    }


    /**
     * createCustomer
     *
     * @param  mixed  $request
     * @return array
     */
    public function createCustomer($request): array
    {
        return [];
    }

    /**
     * attachPaymentMethodToCustomer
     *
     * @param  string  $retrieved_payment_method
     * @param  object  $request
     * @return object
     */
    public function attachPaymentMethodToCustomer(string $retrieved_payment_method, object $request): object
    {
        return (object) [];
    }

    /**
     * detachPaymentMethodToCustomer
     *
     * @param  string  $retrieved_payment_method
     * @return object
     */
    public function detachPaymentMethodToCustomer(string $retrieved_payment_method): object
    {
        return (object) [];
    }


    public function retrievePaymentIntent($payment_intent_id): object
    {
        return (object) [];
    }

    /**
     * confirmPaymentIntent
     *
     * @param  string  $payment_intent_id
     * @param  array  $data
     * @return object
     */
    public function confirmPaymentIntent(string $payment_intent_id, array $data): object
    {
        return (object) [];
    }

    /**
     * setIntent
     *
     * @param  array  $data
     * @return array
     */
    public function setIntent(array $data): array
    {
        return [];
    }

    /**
     * retrievePaymentMethod
     *
     * @param  string  $method_key
     * @return object
     */
    public function retrievePaymentMethod(string $method_key): object
    {
        return (object) [];
    }
}
