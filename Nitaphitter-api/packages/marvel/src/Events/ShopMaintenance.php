<?php

namespace Marvel\Events;

use Marvel\Database\Models\Shop;

class ShopMaintenance
{
    public $shop;

    public $action;

    /**
     * Create a new event instance.
     *
     * @param Shop $shop
     */
    public function __construct(Shop $shop, $action)
    {
        $this->shop = $shop;
        $this->action = $action;
    }
}
