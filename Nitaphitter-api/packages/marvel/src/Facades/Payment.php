<?php

namespace Marvel\Facades;

use Illuminate\Support\Facades\Facade;

class Payment extends Facade
{
    /**
     * 
     * @method static array getIntent(array $data)
     * @method static mixed verify(string $id)
     * @method static void handleWebHooks(object $request)
     * @method static array createCustomer(object $request)
     * @method static object attachPaymentMethodToCustomer(string $retrieved_payment_method, object $request)
     * @method static object detachPaymentMethodToCustomer(string $retrieved_payment_method)
     * @method static object retrievePaymentIntent(string $payment_intent_id)
     * @method static object confirmPaymentIntent(string $payment_intent_id, array $data)
     * @method static array setIntent(array $data)
     * @method static object retrievePaymentMethod(string $method_key)
     * 
     * @see \Marvel\Payments\Payment
     * 
     */
    protected static function getFacadeAccessor()
    {
        return 'payment';
    }
}
