<?php

namespace Marvel\Listeners;

use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\User;
use Marvel\Enums\EventType;
use Marvel\Events\OrderDelivered;
use Marvel\Notifications\OrderDeliveredNotification;
use Marvel\Traits\OrderSmsTrait;
use Marvel\Traits\SmsTrait;

class SendOrderDeliveredNotification implements ShouldQueue
{
    use SmsTrait, OrderSmsTrait;

    /**
     * Handle the event.
     *
     * @param OrderDelivered $event
     * @return void
     */
    public function handle(OrderDelivered $event)
    {

        $order = $event->order;
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_DELIVERED, $order->language);
        if ($emailReceiver['customer'] && $order->customer && $order->parent_id == null) {
            $order->customer->notify(new OrderDeliveredNotification($order));
        }
        if ($emailReceiver['vendor']) {
            if ($order->parent_id) {
                try {
                    $vendor_id = $order->shop->owner_id;
                    $vendor = User::findOrFail($vendor_id);
                    $vendor->notify(new OrderDeliveredNotification($order));
                } catch (Exception $exception) {
                    //
                }
            }
        }
        if ($emailReceiver['admin']) {
            $admins = $this->adminList();
            foreach ($admins as $key => $admin) {
                $admin->notify(new OrderDeliveredNotification($order));
            }
        }
        $this->sendOrderDeliveredSms($order);
    }
}
