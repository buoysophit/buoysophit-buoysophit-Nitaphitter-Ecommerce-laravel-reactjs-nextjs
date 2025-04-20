<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ShopMaintenanceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $shop;

    public $body;

    public $message;

    /**
     * Create a new notification instance.
     *
     * @param $settings
     * @return void
     */
    public function __construct($shop, $body, $message)
    {
        $this->shop = $shop;
        $this->body = $body;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = config('shop.dashboard_url');
        // $start = Carbon::parse($this->shop->settings['shopMaintenance']['start'])->toFormattedDateString();
        // $until = Carbon::parse($this->shop->settings['shopMaintenance']['until'])->toFormattedDateString();
        return (new MailMessage)
            ->subject(APP_NOTICE_DOMAIN . ' Shop Maintenance Reminder')
            ->priority(1)
            ->markdown(
                'emails.maintenance.shop-maintenance',
                [
                    'message' => $this->message,
                    'body' => $this->body,
                    'url' => $url . '/' . $this->shop->slug
                ]
            );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
