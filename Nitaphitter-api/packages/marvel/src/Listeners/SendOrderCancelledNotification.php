<?php

namespace Marvel\Listeners;

use App\Models\User;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Enums\EventType;
use Marvel\Events\OrderCancelled;
use Marvel\Notifications\OrderCancelledNotification;
use Marvel\Traits\OrderSmsTrait;
use Marvel\Traits\SmsTrait;


class SendOrderCancelledNotification implements ShouldQueue
{
    use SmsTrait, OrderSmsTrait;

    /**
     * Handle the event.
     *
     * @param OrderCancelled $event
     * @return void
     */
    public function handle(OrderCancelled $event)
    {
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_CANCELLED, $event->order->language);
        if ($emailReceiver['customer'] && $event->order->customer && $event->order->parent_id == null) {
            $event->order->customer->notify(new OrderCancelledNotification($event->order));
        }
        if ($emailReceiver['vendor']) {
            if ($event->order->parent_id == null) {

                foreach ($event->order->children as $key => $child_order) {
                    try {
                        $vendor_id = $child_order->shop->owner_id;
                        $vendor = User::find($vendor_id);
                        $vendor->notify(new OrderCancelledNotification($event->order));
                    } catch (Exception $exception) {
                        //Log::error($exception->getMessage());
                    }
                }
            } else {
                try {
                    $vendor_id = $event->order->shop->owner_id;
                    $vendor = User::find($vendor_id);
                    $vendor->notify(new OrderCancelledNotification($event->order));
                } catch (Exception $exception) {
                    //
                }
            }
        }
        if ($emailReceiver['admin']) {
            $admins = $this->adminList();
            foreach ($admins as $key => $admin) {

                $admin->notify(new OrderCancelledNotification($event->order));
            }
        }
        $this->sendOrderCancelSms($event->order);
    }
}
