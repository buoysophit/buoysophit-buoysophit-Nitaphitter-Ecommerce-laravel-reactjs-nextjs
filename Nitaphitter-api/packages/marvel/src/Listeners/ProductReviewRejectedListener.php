<?php

namespace Marvel\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Events\ProductReviewRejected;
use Marvel\Notifications\ProductRejectedNotification;

class ProductReviewRejectedListener implements ShouldQueue
{   
    /**
     * Handle the event.
     *
     * @param  ProductReview $event
     * @return void
     */
    public function handle(ProductReviewRejected $event)
    {
        $vendor = $event->product->shop->owner;
        $vendor->notify(new ProductRejectedNotification($event->product));
    }
}
