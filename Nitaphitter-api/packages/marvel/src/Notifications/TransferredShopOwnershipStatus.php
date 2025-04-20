<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;

class TransferredShopOwnershipStatus extends Notification implements ShouldQueue
{
    use Queueable;

    public $shop;

    public $previousOwner;

    public $newOwner;

    public $optional;

    /**
     * Create a new notification instance.
     *
     * @param \Marvel\Database\Models\Shop $shop
     * @param User $previousOwner
     * @param User $newOwner
     * @param mixed $optional
     * 
     * @return void
     */
    public function __construct($shop, $previousOwner, $newOwner, $optional = null)
    {
        $this->shop = $shop;
        $this->previousOwner = $previousOwner;
        $this->newOwner = $newOwner;
        $this->optional = $optional;
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
        $url = config('shop.dashboard_url') . "/{$this->shop->slug}";
        $shopName = $this->shop->name;
        $newOwnerName =  $this->newOwner->name;
        $previousOwnerName = $this->previousOwner->name;
        return (new MailMessage)
            ->subject(APP_NOTICE_DOMAIN . ' Shop Ownership Reminder')
            ->markdown(
                'emails.ownership.status',
                [
                    'shopName'          => $shopName,
                    'newOwnerName'      => $newOwnerName,
                    'previousOwnerName' => $previousOwnerName,
                    'url'               => $url,
                    'message'           => $this->optional['message']
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
