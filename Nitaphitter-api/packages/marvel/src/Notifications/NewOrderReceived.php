<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\App;
use Marvel\Database\Models\Order;

class NewOrderReceived extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected string $receiver;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Order $order, string $receiver = 'storeOwner')
    {
        $this->order = $order;
        $this->receiver = $receiver;
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
        App::setLocale($this->order->language ?? DEFAULT_LANGUAGE);
        $customer =  $this->order->customer ?? null;
        if (!$customer) {
            $customer = 'Guest Customer';
        } else {
            $customer = $customer->name;
        }
        if ($this->receiver == 'admin') {
            $subject = __('sms.order.orderCreated.admin.subject');
            $url  =  config('shop.dashboard_url') . '/orders/' . $this->order->id;
        } else {
            $subject = __('sms.order.orderCreated.storeOwner.subject');
            $url =  config('shop.dashboard_url') . $this->order->shop->slug . '/orders/' . $this->order->id;
        }
        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.order.order-received', ['order' => $this->order, 'customer' => $customer, 'receiver' => $this->receiver, 'url' => $url]);
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
