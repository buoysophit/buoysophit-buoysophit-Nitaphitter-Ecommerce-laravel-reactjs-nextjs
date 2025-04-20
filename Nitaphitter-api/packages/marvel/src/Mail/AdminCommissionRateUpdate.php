<?php

namespace Marvel\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;

class AdminCommissionRateUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public Shop $shop;
    public Balance $balance;

    /**
     * Create a new event instance.
     *
     * @param Shop $shop
     * @param Balance $balance
     */
    public function __construct(Shop $shop, Balance $balance)
    {
        $this->shop = $shop;
        $this->balance = $balance;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.order.admin-commission-rate-update');
    }
}
