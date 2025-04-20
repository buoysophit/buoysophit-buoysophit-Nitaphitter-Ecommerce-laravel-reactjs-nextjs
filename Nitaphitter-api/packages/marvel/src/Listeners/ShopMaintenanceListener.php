<?php

namespace Marvel\Listeners;

use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;
use Marvel\Database\Models\User;
use Marvel\Events\ShopMaintenance;
use Marvel\Notifications\ShopMaintenanceNotification;
use Marvel\Traits\UsersTrait;

class ShopMaintenanceListener implements ShouldQueue
{
    use UsersTrait;

    /**
     * Handle the event.
     *
     * @param  ShopMaintenance  $event
     * @return void
     */
    public function handle(ShopMaintenance $event)
    {
        $action  = $event->action;
        $shop  = $event->shop;


        $shopOwnerAndStaff = User::where(function ($query) use ($shop) {
            $query->where('id', $shop->owner_id)
                ->orWhere('shop_id', $shop->id);
        })
            ->get();

        $adminUsers = $this->getAdminUsers();

        // Merge admin users and shop owner/staff
        $users = $adminUsers->merge($shopOwnerAndStaff);


        $start = Carbon::parse($event->shop->settings['shopMaintenance']['start'])->toDayDateTimeString();
        $until = Carbon::parse($event->shop->settings['shopMaintenance']['until'])->toDayDateTimeString();
        if ($action === 'enable') {
            $message = $shop->name . ' shop is going under maintenance';
            $body = "Due to our regular shop maintenance, this shop will be down from  $start  to  $until .";
        } elseif ($action === 'start') {
            $message = $shop->name . ' shop maintenance period is started';
            $body = "Due to our regular store maintenance, this store maintenance period has started from $start to $until .";
      
        }else {
            $message = $shop->name . ' shop maintenance period is over';
            $body = "Due to our regular store maintenance, this store maintenance is over from $start to $until.";
      
        }

        if ($users) {
            foreach ($users as $user) {
                Notification::route('mail', [
                    $user->email,
                ])->notify(new ShopMaintenanceNotification(
                    $shop,
                    $body,
                    $message
                ));
            }
        }
    }
}
