<?php

namespace Marvel\Listeners;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Enums\EventType;
use Marvel\Events\PaymentSuccess;
use Marvel\Notifications\PaymentSuccessfulNotification;
use Marvel\Traits\OrderSmsTrait;
use Marvel\Traits\SmsTrait;

class SendPaymentSuccessNotification implements ShouldQueue
{
    use SmsTrait, OrderSmsTrait;

    /**
     * Handle the event.
     *
     * @param PaymentSuccess $event
     * @return void
     */
    public function handle(PaymentSuccess $event)
    {
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_PAYMENT_SUCCESS, $event->order->language ?? DEFAULT_LANGUAGE);
        if ($emailReceiver['vendor']) {
            foreach ($event->order->children as $key => $child_order) {
                $vendor_id = $child_order->shop->owner_id;
                $vendor = User::findOrFail($vendor_id);
                $vendor->notify(new PaymentSuccessfulNotification($event->order));
            }
        }

        $customer = $event->order->customer;
        if (isset($customer) && $emailReceiver['customer']) {
            $customer->notify(new PaymentSuccessfulNotification($event->order));
        }


        $this->sendPaymentDoneSuccessfullySms($event->order);
    }
}
