<?php


namespace Marvel\Events;


use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\OwnershipTransfer;


class OwnershipTransferStatusControl implements ShouldQueue
{
    /**
     * @var OwnershipTransfer
     */

    public OwnershipTransfer $ownershipTransfer;


    /**
     * Create a new event instance.
     *
     * @param OwnershipTransfer $ownershipTransfer
     */
    public function __construct(OwnershipTransfer $ownershipTransfer)
    {
        $this->ownershipTransfer = $ownershipTransfer;
    }
}
