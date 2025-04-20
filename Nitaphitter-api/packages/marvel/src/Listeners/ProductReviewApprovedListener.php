<?php

namespace Marvel\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Events\ProductReviewApproved;
use Marvel\Notifications\ProductApprovedNotification;

class ProductReviewApprovedListener implements ShouldQueue
{   
    /**
     * Handle the event.
     *
     * @param  ProductReview $event
     * @return void
     */
    public function handle(ProductReviewApproved $event)
    {
        $vendor = $event->product->shop->owner;
        $vendor->notify(new ProductApprovedNotification($event->product));
    }
}
