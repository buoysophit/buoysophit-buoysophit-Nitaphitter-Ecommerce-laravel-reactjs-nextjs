<?php

namespace Marvel\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\User;
use Marvel\Enums\EventType;
use Marvel\Events\OrderStatusChanged;
use Marvel\Notifications\OrderStatusChangedNotification;
use Marvel\Traits\OrderSmsTrait;
use Marvel\Traits\SmsTrait;

class SendOrderStatusChangedNotification implements ShouldQueue
{
    use SmsTrait, OrderSmsTrait;

    /**
     * Handle the event.
     *
     * @param OrderStatusChanged $event
     * @return void
     */
    public function handle(OrderStatusChanged $event)
    {

        $order = $event->order;
        $customer = $event->order->customer;


        $this->sendOrderStatusChangeSms($order);
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_STATUS_CHANGED, $order->language ?? DEFAULT_LANGUAGE);
        if ($emailReceiver['vendor'] && $order->parent_id != null) {
            $vendor_id = $order->shop->owner_id;
            $vendor = User::find($vendor_id);

            if ($vendor)
                $vendor->notify(new OrderStatusChangedNotification($event->order));
        }
        if ($emailReceiver['customer'] && $order->parent_id == null) {
            $customer->notify(new OrderStatusChangedNotification($event->order));
        }
        if ($emailReceiver['admin']) {
            $admins = $this->adminList();
            foreach ($admins as $key => $admin) {
                $admin->notify(new OrderStatusChangedNotification($order));
            }
        }
    }
}
