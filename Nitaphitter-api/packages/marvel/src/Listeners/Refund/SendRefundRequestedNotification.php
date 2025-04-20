<?php

namespace Marvel\Listeners;


use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Enums\EventType;
use Marvel\Events\RefundRequested;
use Marvel\Traits\OrderSmsTrait;
use Marvel\Traits\SmsTrait;


class SendRefundRequestedNotification implements ShouldQueue
{
    use SmsTrait, OrderSmsTrait;

    /**
     * Handle the event.
     *
     * @param RefundRequested $event
     * @return void
     */
    public function handle(RefundRequested $event)
    {
        $refund = $event->refund;
        $customer = $refund->customer;
        $order = $refund->order;
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::ORDER_REFUND, $order->language);
        if ($emailReceiver['admin']) {
            $admins = $this->adminList();
            foreach ($admins as $admin) {
                $admin->notify(new RefundRequested($refund, 'admin'));
            }
        }
        if ($emailReceiver['customer']) {
            $customer->notify(new RefundRequested($refund, 'customer'));
        }
        $this->sendRefundRequestedSms($refund);
    }
}
