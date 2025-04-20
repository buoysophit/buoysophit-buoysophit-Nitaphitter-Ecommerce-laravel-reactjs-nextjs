<?php

namespace Marvel\Listeners;


use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Notification;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\User;
use Marvel\Enums\Permission;
use Marvel\Events\Maintenance;
use Marvel\Events\StoreNoticeEvent;
use Marvel\Notifications\MaintenanceReminder;
use Marvel\Notifications\StoreNoticeNotification;

class MaintenanceNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param Maintenance $event
     * @return void
     */
    public function handle(Maintenance $event)
    {
        $language  = $event->language;
        $settings = Settings::getData($language);
        $shouldSendEmail = $this->shouldSendEmail($settings);

        if (!$shouldSendEmail) return;

        $admins = User::permission(Permission::SUPER_ADMIN)->pluck('id')->toArray();
        $users = User::permission(Permission::STORE_OWNER)->whereNotIN('id', $admins)->get();
        if ($users) {
            foreach ($users as $user) {
                Notification::route('mail', [
                    $user->email,
                ])->notify(new MaintenanceReminder($settings));
            }
        }
    }

    public function shouldSendEmail(Settings $settings): bool
    {
        $shouldSendEmail = false;
        try {
            $isUnderMaintenance = $settings->options['isUnderMaintenance'] ?? false;
            $currentTime = now();
            $startTime = Carbon::parse($settings->options['maintenance']['start']);

            $shouldSendEmail = $isUnderMaintenance && ($currentTime < $startTime);
        } catch (Exception $th) {
        }
        return $shouldSendEmail;
    }
}
