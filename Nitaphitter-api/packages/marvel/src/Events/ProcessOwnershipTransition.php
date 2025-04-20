<?php


namespace Marvel\Events;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;

class ProcessOwnershipTransition implements ShouldQueue
{
    /**
     * @var Shop
     */

    public $shop;

    /**
     * @var User
     */
    public $previousOwner;

    /**
     * @var User
     */
    public $newOwner;

    public $optional;


    /**
     * Create a new event instance.
     *
     * @param Shop $shop
     * @param User $previousOwner
     * @param User $newOwner
     * @param mixed $optional
     */
    public function __construct(Shop $shop, User $previousOwner, User $newOwner, $optional = null)
    {
        $this->shop = $shop;
        $this->previousOwner = $previousOwner;
        $this->newOwner = $newOwner;
        $this->optional = $optional;
    }
}
