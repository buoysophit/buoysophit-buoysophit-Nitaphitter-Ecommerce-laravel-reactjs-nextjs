<?php

namespace Marvel\Notifications;


use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\App;
use Marvel\Database\Models\Refund;

class RefundRequested extends Notification implements ShouldQueue
{

    use Queueable;

    protected $refund;
    protected string $receiver;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Refund $refund, $receiver = 'admin')
    {
        $this->refund = $refund;
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
        $order = $this->refund->order;
        App::setLocale($order->language ?? DEFAULT_LANGUAGE);
        if ($this->receiver == 'admin') {
            $subject = __('sms.order.refundRequested.admin.subject');
            $url = config('shop.dashboard_url') . '/refunds/' . $this->refund->id;
            return (new MailMessage)
                ->subject($subject)
                ->markdown('emails.refund.refund-updated', [
                    'order'    => $order,
                    'refund'   => $this->refund,
                    'url'      => $url,
                    'receiver' => $this->receiver
                ]);
        } else {
            $subject = __('sms.order.refundRequested.customer.subject');
            $url = config('shop.shop_url') . '/orders/' . $order->tracking_id;
            return (new MailMessage)
                ->subject($subject)
                ->markdown('emails.refund.refund-requested', [
                    'order'    => $order,
                    'refund'   => $this->refund,
                    'url'      => $url,
                    'receiver' => $this->receiver
                ]);
        }
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
