<?php

namespace Marvel\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Marvel\Database\Models\StoreNotice;
use Marvel\Database\Models\User;

class TestPusherEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $store_notice;

    public $user;

    /**
     * Create a new event instance.
     */
    public function __construct(StoreNotice $store_notice, User $user)
    {
        $this->store_notice = $store_notice;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $temp_event_channels = [];
        if (isset($this->store_notice->users)) {
            foreach ($this->store_notice->users as $key => $user) {
                $channel_name = new PrivateChannel('store_notice.created.' . $user->id);
                array_push($temp_event_channels, $channel_name);
            }
        }
        // return [
        // new Channel('store_notice.created'),
        // new PrivateChannel('store_notice.created.' . $this->user->id)
        // ];

        return $temp_event_channels;
    }


    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'store-notice' => $this->store_notice,
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        // event's name will be written here.
        return 'test.pusher.event';
    }
}
