<?php

namespace Marvel\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Enums\EventType;
use Marvel\Events\OrderReceived;
use Marvel\Notifications\NewOrderReceived;
use Marvel\Traits\SmsTrait;

class SendOrderReceivedNotification implements ShouldQueue
{
    use SmsTrait;
    /**
     * Handle the event.
     *
     * @param OrderReceived $event
     * @return void
     */
    public function handle(OrderReceived $event)
    {
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_CREATED, $event->order->language);
        if ($emailReceiver['vendor']) {
            $vendor = $event->order->shop->owner;
            $vendor->notify(new NewOrderReceived($event->order));
        }
    }
}
