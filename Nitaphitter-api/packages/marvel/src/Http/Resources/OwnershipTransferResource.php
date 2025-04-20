<?php

namespace Marvel\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\Shop;
use Marvel\Enums\OrderStatus;

class OwnershipTransferResource extends Resource
{

    // public function orderInfoRelatedToShop($shop_id)
    // {
    //     $query = DB::table('orders')
    //         ->whereNotNull('orders.parent_id')
    //         ->whereDate('orders.created_at', '<=', Carbon::now())
    //         ->where('orders.shop_id', '=', $shop_id)
    //         ->select(
    //             'orders.order_status',
    //             DB::raw('count(*) as order_count')
    //         )
    //         ->groupBy('orders.order_status')
    //         ->pluck('order_count', 'order_status');

    //     return [
    //         'pending'        => $query[OrderStatus::PENDING]           ?? 0,
    //         'processing'     => $query[OrderStatus::PROCESSING]        ?? 0,
    //         'complete'       => $query[OrderStatus::COMPLETED]         ?? 0,
    //         'cancelled'      => $query[OrderStatus::CANCELLED]         ?? 0,
    //         'refunded'       => $query[OrderStatus::REFUNDED]          ?? 0,
    //         'failed'         => $query[OrderStatus::FAILED]            ?? 0,
    //         'localFacility'  => $query[OrderStatus::AT_LOCAL_FACILITY] ?? 0,
    //         'outForDelivery' => $query[OrderStatus::OUT_FOR_DELIVERY]  ?? 0,
    //     ];
    // }

    // public function balanceInfoRelatedToShop($shop_id)
    // {
    //     $shopBalanceInfo =  DB::table('balances')->where('shop_id', '=', $shop_id)->first();
    //     return $shopBalanceInfo;
    // }

    // public function refundInfoRelatedToShop($shop_id)
    // {
    //     $shopRefundInfo =  DB::table('refunds')->where('shop_id', '=', $shop_id)->get();
    //     return $shopRefundInfo;
    // }

    // public function withdrawInfoRelatedToShop($shop_id)
    // {
    //     $shopRefundInfo =  DB::table('withdraws')->where('shop_id', '=', $shop_id)->get();
    //     return $shopRefundInfo;
    // }

    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'transaction_identifier' => $this->transaction_identifier,
            'previous_owner'         => $this->previous_owner,
            'current_owner'          => $this->current_owner,
            'message'                => $this->message,
            'created_by'             => $this->created_by,
            'status'                 => $this->status,
            'shop'                   => new ShopResource($this->whenLoaded('shop')),
            'order_info' => $this->order_info,
            'balance_info' => $this->balance_info,
            'refund_info' => $this->refund_info,
            'withdrawal_info' => $this->withdrawal_info,
        ];
    }
}
