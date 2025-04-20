<?php

namespace Marvel\Payments;

use Exception;
use Marvel\Database\Models\Order;
use Marvel\Exceptions\MarvelException;
use Marvel\Traits\PaymentTrait;
use Luigel\Paymongo\Facades\Paymongo as PaymongoFacade;
use Marvel\Enums\OrderStatus;
use Marvel\Enums\PaymentStatus;
use Stripe\Exception\SignatureVerificationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Paymongo extends Base implements PaymentInterface
{
    use PaymentTrait;

    public PaymongoFacade $PaymongoFacade;

    public function __construct()
    {
        parent::__construct();
        $this->PaymongoFacade = new PaymongoFacade(config('shop.paymongo.public_key'), config('shop.paymongo.secret_key'));
    }

    /**
     * Get payment intent for payment
     *
     * @param $data
     * @return array
     * @throws MarvelException
     */
    public function getIntent($data): array
    {
        try {
            extract($data);
            $redirectUrl = config('shop.shop_url');

            $order = PaymongoFacade::source()->create([
                'type' =>  $selected_payment_path,
                'amount' => round($amount),
                'currency' => $this->currency,
                "metadata" => [
                    "tracking_number" => $order_tracking_number,
                ],
                'redirect' => [
                    "success" => "{$redirectUrl}/orders/{$order_tracking_number}/thank-you",
                    "failed" => "{$redirectUrl}/orders/{$order_tracking_number}/thank-you"
                ]
            ]);

            return [
                'payment_id'   => $order->id,
                'amount'       => $order->amount,
                'invoice_id'   => $order_tracking_number,
                'redirect_url' => $order->redirect['checkout_url'],
                'is_redirect'  => true,
            ];
        } catch (Exception $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }

    /**
     * Verify a payment
     *
     * @param $id
     * @return false|mixed
     * @throws MarvelException
     */
    public function verify($paymentId): mixed
    {
        $source = PaymongoFacade::source()->find($paymentId);
        try {
            if ($source->status == 'chargeable') {
                $order = PaymongoFacade::payment()->create([
                    'amount' => $source->amount,
                    'currency' => $this->currency,
                    'description' => 'Payment Source',
                    'statement_descriptor' => 'Source Paymongo',
                    'source' => [
                        'id' => $source->id,
                        'type' => 'source'
                    ]
                ]);
                return $order->status ?? false;
            }
            return $source->status ?? false;
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
            $payload = @file_get_contents('php://input');
            $signatureHeader = $_SERVER['HTTP_PAYMONGO_SIGNATURE'];
            $webhookSecretKey = config('shop.paymongo.webhook_sig');
        } catch (SignatureVerificationException $e) {
            // Invalid signature
            http_response_code(400);
            exit();
        }

        $eventStatus = $request['data']['attributes']['data']['attributes']['status'];
        switch ($eventStatus) {
            case 'chargeable':
                $this->updatePaymentOrderStatus($request, OrderStatus::PROCESSING, PaymentStatus::SUCCESS);
                break;
            case 'payment.paid':
                $this->updatePaymentOrderStatus($request, OrderStatus::PROCESSING, PaymentStatus::SUCCESS);
                break;
            case 'payment.failed ':
                $this->updatePaymentOrderStatus($request, OrderStatus::FAILED, PaymentStatus::FAILED);
                break;
        }

        // To prevent loop for any case
        http_response_code(200);
        exit();
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
        $trackingId = $request['data']['attributes']['data']['attributes']['metadata']['tracking_number'];
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
