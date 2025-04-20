<?php

namespace Marvel\Listeners;

use App\Events\ReviewCreated;
use App\Notifications\NewReviewCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Marvel\Database\Models\NotifyLogs;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Shop;
use Marvel\Enums\EventType;
use Illuminate\Support\Facades\Cache;
use Marvel\Database\Models\User;
use Marvel\Enums\Permission;
use Marvel\Events\StoreNoticeEvent;
use Marvel\Traits\UsersTrait;

class StoredStoreNoticeNotifyLogsListener implements ShouldQueue
{

    use UsersTrait;

    /**
     * Handle the event.
     *
     * @param  StoreNoticeEvent  $event
     * @return void
     */
    public function handle(StoreNoticeEvent $event)
    {
        // save notification for vendor
        if (isset($event->storeNotice->users)) {
            foreach ($event->storeNotice->users as $key => $user) {
                NotifyLogs::create([
                    'receiver' => $user->id,
                    'sender' =>  $event->user->id,
                    'notify_type' => 'store_notice',
                    'notify_receiver_type' => 'vendor',
                    'is_read' => false,
                    'notify_text' =>  mb_substr($event->storeNotice->notice, 0, 15) . '...',
                    'notify_tracker' => $event->storeNotice->id
                ]);
            }
        }
    }
}
