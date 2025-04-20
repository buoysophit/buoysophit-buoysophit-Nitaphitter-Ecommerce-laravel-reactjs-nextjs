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
use Marvel\Events\MessageSent;
use Marvel\Traits\UsersTrait;

class StoredMessagedNotifyLogsListener implements ShouldQueue
{

    use UsersTrait;

    /**
     * Handle the event.
     *
     * @param  MessageSent  $event
     * @return void
     */
    public function handle(MessageSent $event)
    {
        switch ($event->type) {
            case 'shop':
                // save notification for vendor
                $shop_owner = Shop::findOrFail($event->conversation->shop_id);
                NotifyLogs::create([
                    'receiver' => $shop_owner->owner_id,
                    'sender' =>  $event->user->id,
                    'notify_type' => 'message',
                    'notify_receiver_type' => 'vendor',
                    'is_read' => false,
                    'notify_text' => mb_substr($event->message->body, 0, 15) . '...',
                    'notify_tracker' => $event->conversation->id
                ]);

                break;

            case 'user':
                // save notification for admin
                $admins = $this->getAdminUsers();
                if (isset($admins)) {
                    foreach ($admins as $key => $admin) {
                        NotifyLogs::create([
                            'receiver' => $admin->id,
                            'sender' =>  $event->user->id,
                            'notify_type' => 'message',
                            'notify_receiver_type' => 'admin',
                            'is_read' => false,
                            'notify_text' => mb_substr($event->message->body, 0, 15) . '...',
                            'notify_tracker' => $event->conversation->id
                        ]);
                    }
                }
                break;
        }
    }
}
