<?php

namespace Marvel\Listeners\Refund;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Enums\EventType;
use Marvel\Events\RefundUpdate;
use Marvel\Traits\OrderSmsTrait;
use Marvel\Traits\SmsTrait;

class SendRefundUpdateNotification implements ShouldQueue
{
    use SmsTrait, OrderSmsTrait;

    /**
     * Handle the event.
     * @param RefundUpdate $event
     * @return void
     */
    public function handle(RefundUpdate $event)
    {
        $refund = $event->refund;
        $order = $refund->order;
        if ($order->parent_id) return;
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_REFUND, $event->refund->order->language);

        if ($emailReceiver['customer'] && $refund->customer()) {
            $refund->customer->notify(new RefundUpdate($refund, 'customer'));
        }

        if ($emailReceiver['admin']) {
            $admins = $this->adminList();
            foreach ($admins as $admin) {
                $admin->notify(new RefundUpdate($refund, 'admin'));
            }
        }
    }
}
