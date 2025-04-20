<?php


namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\OwnershipTransfer;
use Marvel\Enums\OrderStatus;
use Marvel\Exceptions\MarvelBadRequestException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class OwnershipTransferRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'transaction_identifier' => 'like',
        'shop_id',
        'status',
        'from',
        'to'
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
            //
        }
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return OwnershipTransfer::class;
    }

    public function updateOwnershipTransfer(Request $request)
    {
        $id = $request?->id;
        $transferHistory = $this->findOrFail($id);

        $shopId = $transferHistory->shop_id ?? null;
        $shop = $transferHistory->shop;

        $currentBalance = $shop->balance?->current_balance;
        $totalIncompleteOrders = Order::where('shop_id', $shopId)
            ->whereIn(
                'order_status',
                [
                    OrderStatus::PENDING,
                    OrderStatus::PROCESSING,
                    OrderStatus::AT_LOCAL_FACILITY,
                    OrderStatus::OUT_FOR_DELIVERY
                ]
            )->count();

        $nonApprovedWithdrawCount = count(array_filter($shop->withdraws->toArray(), function ($withdraw) {
            return $withdraw['status'] !== 'approved';
        }));

        // Required : no running order, all order must be completed.
        // Required : balance should be or less than $1.00, then the shop can be transferred.
        // Required : no running withdrawal request.
        // 
        // if those 3 above condition is true, then a shop status can be changed.
        if ($totalIncompleteOrders || (round($currentBalance, 2) > 1.00) || $nonApprovedWithdrawCount) {
            throw new MarvelBadRequestException(COULD_NOT_SETTLE_THE_TRANSITION);
        }
        $transferHistory->update(['status' => $request['status']]);
        return $transferHistory->refresh();
    }

    public function getOwnershipTransferHistory($request)
    {
        $ownershipTransfer =  $this->where('transaction_identifier', '=', $request->transaction_identifier)->with(['shop'])->firstOrFail();
        if ($request->request_view_type === 'detail') {
            $orderInfoRelatedToShop = $this->orderInfoRelatedToShop($ownershipTransfer->shop->id) ?? [];
            $balanceInfoRelatedToShop = $this->balanceInfoRelatedToShop($ownershipTransfer->shop->id) ?? [];
            $refundInfoRelatedToShop =  $this->refundInfoRelatedToShop($ownershipTransfer->shop->id) ?? [];
            $withdrawInfoRelatedToShop = $this->withdrawInfoRelatedToShop($ownershipTransfer->shop->id) ?? [];

            $ownershipTransfer->setRelation('order_info', $orderInfoRelatedToShop);
            $ownershipTransfer->setRelation('balance_info', $balanceInfoRelatedToShop);
            $ownershipTransfer->setRelation('refund_info', $refundInfoRelatedToShop);
            $ownershipTransfer->setRelation('withdrawal_info', $withdrawInfoRelatedToShop);
        }
        return $ownershipTransfer;
    }

    public function orderInfoRelatedToShop($shop_id)
    {
        $query = DB::table('orders')
            ->whereNotNull('orders.parent_id')
            ->whereDate('orders.created_at', '<=', Carbon::now())
            ->where('orders.shop_id', '=', $shop_id)
            ->select(
                'orders.order_status',
                DB::raw('count(*) as order_count')
            )
            ->groupBy('orders.order_status')
            ->pluck('order_count', 'order_status');

        return [
            'pending'        => $query[OrderStatus::PENDING]           ?? 0,
            'processing'     => $query[OrderStatus::PROCESSING]        ?? 0,
            'complete'       => $query[OrderStatus::COMPLETED]         ?? 0,
            'cancelled'      => $query[OrderStatus::CANCELLED]         ?? 0,
            'refunded'       => $query[OrderStatus::REFUNDED]          ?? 0,
            'failed'         => $query[OrderStatus::FAILED]            ?? 0,
            'localFacility'  => $query[OrderStatus::AT_LOCAL_FACILITY] ?? 0,
            'outForDelivery' => $query[OrderStatus::OUT_FOR_DELIVERY]  ?? 0,
        ];
    }

    public function balanceInfoRelatedToShop($shop_id)
    {
        $shopBalanceInfo =  DB::table('balances')->where('shop_id', '=', $shop_id)->first();
        return $shopBalanceInfo;
    }

    public function refundInfoRelatedToShop($shop_id)
    {
        $shopRefundInfo =  DB::table('refunds')->where('shop_id', '=', $shop_id)->get();
        return $shopRefundInfo;
    }

    public function withdrawInfoRelatedToShop($shop_id)
    {
        $shopRefundInfo =  DB::table('withdraws')->where('shop_id', '=', $shop_id)->get();
        return $shopRefundInfo;
    }
}
