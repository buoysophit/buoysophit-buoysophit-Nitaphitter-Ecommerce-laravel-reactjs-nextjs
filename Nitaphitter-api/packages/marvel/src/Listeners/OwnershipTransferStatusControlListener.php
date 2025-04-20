<?php

namespace Marvel\Listeners;


use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;
use Marvel\Database\Models\Product;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;
use Marvel\Events\OwnershipTransferStatusControl;
use Marvel\Notifications\TransferredShopOwnershipStatus;
use Marvel\Traits\UsersTrait;


class OwnershipTransferStatusControlListener implements ShouldQueue
{
    use UsersTrait;

    /**
     * Handle the event.
     *
     * @param OwnershipTransferStatusControl $event
     * @return void
     */
    public function handle(OwnershipTransferStatusControl $event)
    {
        switch ($event->ownershipTransfer->status) {
            case 'processing':
                $this->processingOwnerShipTransferStatus($event->ownershipTransfer);
                break;

            case 'approved':
                $this->approvedOwnerShipTransferStatus($event->ownershipTransfer);
                break;

            case 'rejected':
                $this->rejectingOwnerShipTransferStatus($event->ownershipTransfer);
                break;
        }
    }


    public function processingOwnerShipTransferStatus($ownershipRequest)
    {
        // disable shop
        $shop = $ownershipRequest->shop;
        $shop->is_active = false;
        $shop->save();
        $shop->refresh();
        // draft products
        Product::where('shop_id', '=', $ownershipRequest->shop_id)->update(['status' => 'draft']);

        $message = [
            'message' => 'Shop transfer request #' . $ownershipRequest->transaction_identifier . ' is on processing.'
        ];
        $this->notificationThrowingFunction($shop, $ownershipRequest, $message);
    }

    public function approvedOwnerShipTransferStatus($ownershipRequest)
    {
        $shop = $ownershipRequest->shop;
        $shop->owner_id = $ownershipRequest->to;
        $shop->save();
        $shop->refresh();
        $message = [
            'message' => 'Congratulations! Shop transfer request #' . $ownershipRequest->transaction_identifier . ' is approved.'
        ];
        $this->notificationThrowingFunction($shop, $ownershipRequest, $message);
    }

    public function rejectingOwnerShipTransferStatus($ownershipRequest)
    {
        // disable shop
        $shop = $ownershipRequest->shop;
        $shop->is_active = false;
        $shop->save();
        // draft products
        Product::where('shop_id', '=', $ownershipRequest->shop_id)->update(['status' => 'draft']);
        $message = [
            'message' => 'Sorry! Shop transfer request #' . $ownershipRequest->transaction_identifier . ' is rejected. For more details please contact with site admin.'
        ];
        $this->notificationThrowingFunction($shop, $ownershipRequest, $message);
    }


    public function notificationThrowingFunction($shop, $ownershipRequest, $message)
    {
        $previousOwner = User::findOrFail($ownershipRequest->from);
        $newOwner = User::findOrFail($ownershipRequest->to);
        $users = [...$this->getAdminUsers(), $previousOwner, $newOwner];
        if ($users) {
            foreach ($users as $user) {
                Notification::route('mail', [
                    $user->email,
                ])->notify(new TransferredShopOwnershipStatus(
                    $shop,
                    $previousOwner,
                    $newOwner,
                    $message
                ));
            }
        }
    }
}
