<?php

namespace Marvel\Http\Controllers;

use Illuminate\Http\Request;
use Marvel\Facades\Payment;
use Marvel\Payments\Flutterwave;

class WebHookController extends CoreController
{

    public function stripe(Request $request)
    {
        return Payment::handleWebHooks($request);
    }

    public function paypal(Request $request)
    {
        return Payment::handleWebHooks($request);
    }

    public function razorpay(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function mollie(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function paystack(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function paymongo(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function xendit(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function iyzico(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function bkash(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function flutterwave(Request $request)
    {
        return Payment::handleWebHooks($request);
    }
    public function callback(Request $request)
    { 
        return Flutterwave::callback($request);
    }
}
