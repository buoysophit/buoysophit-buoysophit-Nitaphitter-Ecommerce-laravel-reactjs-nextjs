<?php


namespace Marvel\Events;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\StoreNotice;
use Marvel\Database\Models\User;
use Marvel\Exceptions\MarvelException;

class StoreNoticeEvent implements ShouldQueue, ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * user
     *
     * @var User
     */
    public $user;

    /**
     * storeNotice
     *
     * @var StoreNotice
     */
    public $storeNotice;

    /**
     * action
     *
     * @var string
     */
    public $action;

    /**
     * Create a new event instance.
     *
     * @param StoreNotice|array $storeNotice
     * @param null|string $action
     * @param User|array $user
     * 
     * @return void
     */
    public function __construct(StoreNotice $storeNotice, ?string $action, User $user)
    {
        $this->storeNotice = $storeNotice;
        $this->action = $action;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $event_channels = [];
        if (isset($this->storeNotice->users)) {
            foreach ($this->storeNotice->users as $key => $user) {
                $channel_name = new PrivateChannel('store_notice.created.' . $user->id);
                array_push($event_channels, $channel_name);
            }
        }
        return $event_channels;
    }


    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            // 'store_notice' => $this->storeNotice,
            'message' => '1 new store notice.',
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        // event's name will be written here.
        return 'store.notice.event';
    }

    /**
     * Determine if this event should broadcast.
     */
    public function broadcastWhen(): bool
    {
        try {
            $settings = Settings::first();
            $enableBroadCast = false;

            if (config('shop.pusher.enabled') === null) {
                return false;
            }

            if (isset($settings->options['pushNotification']['all']['storeNotice'])) {
                if ($settings->options['pushNotification']['all']['storeNotice'] == true && $this->action = 'create') {
                    $enableBroadCast = true;
                }
            }
            return $enableBroadCast;
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }
}
