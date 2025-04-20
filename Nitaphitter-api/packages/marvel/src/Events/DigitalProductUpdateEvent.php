<?php


namespace Marvel\Events;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\User;

class DigitalProductUpdateEvent implements ShouldQueue
{

    public $product;

    public $user;

    public $optional_data;

    /**
     * Create a new event instance.
     *
     * @param  $flash_sale
     */
    public function __construct(Product $product, User $user, $optional_data = null)
    {
        $this->product = $product;
        $this->user = $user;
        $this->optional_data = $optional_data;
    }
}
