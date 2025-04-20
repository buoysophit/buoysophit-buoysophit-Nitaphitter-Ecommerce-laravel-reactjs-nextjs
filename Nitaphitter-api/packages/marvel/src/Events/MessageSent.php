<?php

namespace Marvel\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Marvel\Database\Models\Conversation;
use Marvel\Database\Models\Message;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;
use Marvel\Exceptions\MarvelException;
use Marvel\Enums\Permission;
use Marvel\Traits\UsersTrait;
use Pusher\Pusher;

// why it does not implement queue ? is it for instant delivery or there are another reasons ?
class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels, UsersTrait;

    /**
     * user
     *
     * @var User
     */
    public $user;

    /**
     * message
     *
     * @var Message
     */
    public $message;

    /**
     * conversation
     *
     * @var Conversation
     */
    public $conversation;

    /**
     * type
     *
     */
    public $type;

    /**
     * Create a new event instance.
     *
     * @param Message $message
     * @param Conversation $conversation
     * @param $type
     *
     */
    public function __construct(Message $message, Conversation $conversation, $type, User $user)
    {
        $this->message = $message;
        $this->conversation = $conversation;
        $this->type = $type;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        switch ($this->type) {
            case 'shop':
                // this case happen when admin send message to shop/vendor
                $shop_owner = Shop::findOrFail($this->conversation->shop_id);
                return [
                    new PrivateChannel('message.created.' . $shop_owner->owner_id)
                ];
                break;

            case 'user':
                // this case happen when user send message to admin
                $event_channels = [];
                foreach ($this->getAdminUsers() as $key => $user) {
                    $channel_name = new PrivateChannel('message.created.' . $user->id);
                    array_push($event_channels, $channel_name);
                }
                return $event_channels;
                break;
        }
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'message' => '1 new message',
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        // event's name will be written here.
        return 'message.event';
    }

    /**
     * Determine if this event should broadcast.
     */
    public function broadcastWhen(): bool
    {
        try {
            $settings = Settings::first();
            $enableBroadCast = false;

            if (!config('shop.pusher.enabled')) {
                return false;
            }

            if (isset($settings->options['pushNotification']['all']['message'])) {
                if ($settings->options['pushNotification']['all']['message'] == true) {
                    $enableBroadCast = true;
                }
            }
            return $enableBroadCast;
            // return $settings->options['pushNotification']['all']['message'] == true;
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }
}
