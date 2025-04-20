<?php

namespace Marvel\Traits;

use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Commission;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Settings;
use Marvel\Enums\OrderStatus;
use Marvel\Enums\PaymentStatus;
use Marvel\Events\CommissionRateUpdateEvent;
use Marvel\Events\OrderCancelled;
use Marvel\Events\OrderDelivered;
use Marvel\Events\OrderStatusChanged;
use Marvel\Events\PaymentFailed;
use Marvel\Events\PaymentSuccess;

trait OrderStatusManagerWithPaymentTrait
{

    /**
     * manageVendorBalance
     *
     * @param mixed $order
     * @param mixed $order_status
     * @param mixed $payment_status
     * @return void
     */
    public function manageVendorBalance($order, $order_status, $prev_order_status)
    {
        //check if new status is completed then add balance to vendor
        if ($order_status === OrderStatus::COMPLETED) $this->checkIfChildOrder($order, 'add');
        //check if previous status was completed then we need to deduct the amount from vendor balance
        elseif ($prev_order_status === OrderStatus::COMPLETED) $this->checkIfChildOrder($order, 'deduct');
    }

    /**
     * checkIfChildOrder
     *
     * @param  mixed $order
     * @param  mixed $type
     * @return void
     */
    public function checkIfChildOrder($order, $type)
    {
        //check if order is child order
        if ($order->parent_id) {
            $parent_order = Order::find($order->parent_id);
            //check if parent order is mark completed then add vendor balance or continue
            if ($parent_order->order_status === OrderStatus::COMPLETED)
                $this->updateBalanceShop($order, $type);
        } else {
            //this is a parent order and check if a child order is completed then add vendor balance or continue
            $child_orders = $order->children;
            if ($child_orders->count() > 0) {
                foreach ($child_orders as $child_order) {
                    if ($child_order->order_status === OrderStatus::COMPLETED)
                        $this->updateBalanceShop($child_order, $type);
                }
            }
        }
    }


    /**
     * updateBalanceShop
     *
     * @param mixed $order
     * @return void
     */
    protected function updateBalanceShop($order, $action_type = 'add')
    {
        $balance = Balance::where('shop_id', '=', $order->shop_id)->first();
        $settings = Settings::getData();
        $isMultiCommissionRate = $settings['options']['isMultiCommissionRate'];
        $total_earnings = $balance->total_earnings;
        $adminCommissionDefaultRate = $this->getCommissionRate($total_earnings);
        $adminCommissionCustomRate = $balance->admin_commission_rate;
        if ($isMultiCommissionRate) {
            if (!$balance->is_custom_commission) {
                $shop_earnings = ($order->total * (100 - $adminCommissionDefaultRate)) / 100;
                // $balance->admin_commission_rate = $adminCommissionDefaultRate;
            } else {
                $shop_earnings = ($order->total * (100 - $adminCommissionCustomRate)) / 100;
            }
        } else {
            $shop_earnings = ($order->total * (100 - $adminCommissionCustomRate)) / 100;
        }

        if ($action_type == 'deduct') $shop_earnings = $shop_earnings * -1;
        $balance->total_earnings = $balance->total_earnings + $shop_earnings;

        if ($isMultiCommissionRate) {
            if (!$balance->is_custom_commission) {
                $updateAdminCommissionRate = $this->getCommissionRate($balance->total_earnings);
                $balance->admin_commission_rate = $updateAdminCommissionRate;
            }
        }

        $balance->current_balance = $balance->current_balance + $shop_earnings;
        $balance->save();
        if ($isMultiCommissionRate) {
            if (!$balance->is_custom_commission) {
                if ($adminCommissionDefaultRate != $updateAdminCommissionRate) {
                    event(new CommissionRateUpdateEvent($order->shop, $balance));
                }
            }
        }
    }

    public function getCommissionRate($total_earnings)
    {
        $commission = Commission::where('min_balance', '<=', $total_earnings)
            ->where(function ($query) use ($total_earnings) {
                $query->whereRaw('CAST(max_balance AS UNSIGNED) >= ?', [$total_earnings])
                    ->orWhere('max_balance', 'over');
            })
            ->first();
        return $commission->commission ?? 0;
    }


    /**
     * orderStatusManagementOnPayment
     *
     * @param  mixed $order
     * @param  mixed $order_status
     * @param  mixed $payment_status
     * @return void
     */
    public function orderStatusManagementOnPayment($order, $order_status, $payment_status)
    {

        switch ($payment_status) {
            case PaymentStatus::SUCCESS:
                event(new PaymentSuccess($order));
                break;
            case PaymentStatus::FAILED:
                event(new PaymentFailed($order));
                break;
            case PaymentStatus::REVERSAL:
                event(new PaymentFailed($order));
                break;
            case PaymentStatus::PENDING:
                # code...
                # send notification to user about order is pending.
                break;
            case PaymentStatus::PROCESSING:
                # code...
                # send notification to user about order is processing.
                break;

            case PaymentStatus::AWAITING_FOR_APPROVAL:
                # code...
                # send notification to user about order is pending & payment is waiting for approval.
                break;
        }
        $this->fireEventOnOrderStatus($order, $order_status);
    }

    /**
     * orderStatusManagementOnCOD
     *
     * @param  mixed $order
     * @param  string $prev_status
     * @param  string $new_status
     * @return void
     */
    public function orderStatusManagementOnCOD($order, $prev_status, $new_status)
    {
        switch ($new_status) {
            case OrderStatus::CANCELLED:
                # code...
                $this->orderStatusManagementOnCancelled($order);
                event(new OrderCancelled($order));
                break;

            case OrderStatus::REFUNDED:
                # code...
                event(new OrderCancelled($order));
                break;

            case OrderStatus::FAILED:
                # code...
                break;
            case OrderStatus::PROCESSING:
                # do nothing
                # this event already has been fired from OrderRepository
                break;
            default:
                event(new OrderStatusChanged($order));
                break;
        }
    }


    public function fireEventOnOrderStatus($order, $currentStatus)
    {
        switch ($currentStatus) {
            case OrderStatus::CANCELLED:
                # code...
                $this->orderStatusManagementOnCancelled($order);
                event(new OrderCancelled($order));
                break;

            case OrderStatus::REFUNDED:
                $this->orderStatusManagementOnCancelled($order);
                event(new OrderCancelled($order));
                break;

            case OrderStatus::FAILED:
                $this->orderStatusManagementOnCancelled($order);
                event(new OrderCancelled($order));
                break;

            default:
                event(new OrderStatusChanged($order));
                break;
        }
    }

    /**
     * orderAlreadyExists
     *
     * @param  mixed $order
     * @param  string $tracking_number
     * @return bool
     */
    public function orderAlreadyExists($tracking_number)
    {
        try {
            $order_exists = false;
            $order_exists = Order::where('tracking_number', '=', $tracking_number)->exists();
            if ($order_exists) {
                return true;
            }
            return $order_exists;
        } catch (\Exception $e) {
            throw $e;
        }
    }
    /**
     * orderStatusManagementOnCancelled
     *
     * @param  mixed $order
     * @return void
     */
    public function orderStatusManagementOnCancelled($order)
    {
        if ($order->parent_id) {
            $parent_order = Order::find($order->parent_id);
        } else {
            $parent_order = $order;
        }

        $tax_amount = $parent_order->sales_tax;
        $delivery_fee = $parent_order->delivery_fee;
        $currently_paid = $parent_order->paid_total;
        $amount = $currently_paid - $tax_amount - $delivery_fee;
        $tax_rate = 0;
        if ($amount > 0) {
            $tax_rate = $tax_amount / $amount;
            //for precision
            $tax_rate = $tax_rate * 1000000;
        }

        // if order is child order
        if ($order->parent_id) {
            $reducedRevenueAmount = $amount - $order->amount;
            $cancelledTaxAmount = ($order->amount * $tax_rate) / 1000000;
            $reducedTaxAmount = $parent_order->sales_tax - $cancelledTaxAmount; //for precision

            $parent_order->sales_tax = $reducedTaxAmount;
            $parent_order->cancelled_tax += $cancelledTaxAmount;

            $parent_order->paid_total = $reducedRevenueAmount + $reducedTaxAmount + $delivery_fee;
            $parent_order->total = $reducedRevenueAmount + $reducedTaxAmount + $delivery_fee;
            $parent_order->cancelled_amount = $parent_order->cancelled_amount + $order->amount + ($order->amount * $tax_rate) / 1000000;
            $parent_order->save();
            //TODO: give refund to customer if order is pre paid
            if ($parent_order->paid_total == 0) {
                $parent_order->cancelled_delivery_fee = $parent_order->delivery_fee;
                $parent_order->delivery_fee = 0;
                $parent_order->sales_tax = 0;
                $parent_order->save();
            }

            //add cancel amount to the order
            $order->cancelled_amount = $order->total;
            $order->paid_total = 0;
            $order->total = 0;
            $order->save();
        } else {
            $childOrders = $parent_order->children;
            foreach ($childOrders as $childOrder) {
                if ($childOrder->order_status == OrderStatus::CANCELLED) continue;
                $childOrder->cancelled_amount = $childOrder->total;
                $childOrder->paid_total = 0;
                $childOrder->total = 0;
                $childOrder->save();
            }
            $parent_order->cancelled_amount += $parent_order->paid_total;
            $parent_order->cancelled_tax += $parent_order->sales_tax;
            $parent_order->cancelled_delivery_fee = $parent_order->delivery_fee;
            $parent_order->sales_tax = 0;
            $parent_order->delivery_fee = 0;
            $parent_order->paid_total = 0;
            $parent_order->total = 0;
            $parent_order->save();
            //TODO: give refund to customer if order is pre paid

        }
    }


    /**
     * The function checks if the order status is one of the final statuses.
     * 
     * @param Order order The parameter "order" is an instance of the Order class.
     * 
     * @return bool a boolean value, indicating whether the order status is final or not.
     */
    public function checkOrderStatusIsFinal(Order $order): bool
    {
        $orderStatuses = [OrderStatus::COMPLETED, OrderStatus::CANCELLED, OrderStatus::REFUNDED];
        return in_array($order->order_status, $orderStatuses);
    }
}
