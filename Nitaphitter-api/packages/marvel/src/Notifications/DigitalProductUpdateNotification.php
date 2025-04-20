<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\User;

class DigitalProductUpdateNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;

    protected $product;

    protected $optional_message;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, Product $product, $optional_message = null)
    {
        $this->user = $user;
        $this->product = $product;
        $this->optional_message = $optional_message;
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
        return (new MailMessage)
            ->subject('New product update is available.')
            ->markdown(
                'products.digital_product.update',
                [
                    'user' => $this->user,
                    'product' => $this->product,
                    'url' => config('shop.shop_url') . '/products/' . $this->product->slug,
                    'optional_message' => $this->optional_message,
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
