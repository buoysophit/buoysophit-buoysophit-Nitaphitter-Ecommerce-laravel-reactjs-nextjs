<?php

namespace App\Listeners;

use App\Events\ReviewCreated;
use App\Notifications\NewReviewCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Marvel\Database\Models\Shop;
use Marvel\Enums\EventType;
use Marvel\Events\CommissionRateUpdateEvent;
use Marvel\Traits\SmsTrait;
use App\Mail\CommissionRateUpdateNotificationMail;
use Exception;
use Illuminate\Support\Facades\Mail;
use Marvel\Mail\AdminCommissionRateUpdate;
use Marvel\Mail\CommissionRateUpdate;
use Marvel\Mail\CommissionRateUpdateForAdminMail;
use Marvel\Mail\VendorCommissionRateUpdate;
use Marvel\Traits\UsersTrait;

class CommissionRateUpdateListener
{
    use SmsTrait, UsersTrait;

    /**
     * Handle the event.
     *
     * @param  CommissionRateUpdateEvent  $event
     * @return void
     */
    public function handle(CommissionRateUpdateEvent $event)
    {
        $shop = $event->shop;
        $balance = $event->balance;
        
        try{
            $admins = $this->getAdminUsers();
            if($admins){
                foreach($admins as $admin){
                    Mail::to($admin->email)->send(new AdminCommissionRateUpdate($shop, $balance));
                }
            }
            Mail::to($shop->owner->email)->send(new VendorCommissionRateUpdate($shop, $balance));
        }catch(Exception $e){
            logger("Error in CommissionRateUpdateListener! ".  $e->getMessage());
        }

   
    }
}
