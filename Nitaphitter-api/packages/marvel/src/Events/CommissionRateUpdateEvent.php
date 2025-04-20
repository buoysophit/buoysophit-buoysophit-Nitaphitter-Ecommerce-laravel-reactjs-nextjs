<?php

namespace Marvel\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Refund;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;

class CommissionRateUpdateEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

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
}
