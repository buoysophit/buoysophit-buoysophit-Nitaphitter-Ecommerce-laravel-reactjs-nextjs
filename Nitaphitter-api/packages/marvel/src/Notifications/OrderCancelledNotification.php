<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\App;
use Marvel\Database\Models\Order;
use Marvel\Traits\SmsTrait;

class OrderCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable, SmsTrait;

    protected $order;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        App::setLocale($this->order->language);
        return (new MailMessage)
            ->subject(__('sms.order.cancelOrder.admin.subject'))
            ->markdown(
                'emails.order.order-cancelled',
                [
                    'order' => $this->order,
                    'url' => config('shop.shop_url') . '/orders/' . $this->order->tracking_number
                ]
            );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
