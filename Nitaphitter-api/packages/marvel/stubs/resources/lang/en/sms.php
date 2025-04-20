<?php
return [
    'order' => [
        'cancelOrder'         => [
            'admin'      => [
                'message' => 'Order has been cancelled  with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order has been cancelled',
            ],
            'customer'   => [
                'message' => 'Your order has been  cancelled and  tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your order has been cancelled',
            ],
            'storeOwner' => [
                'message' => 'Dear shop owner,Order has been cancelled  with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order has been cancelled',
            ],
        ],
        'orderCreated'        => [
            'admin'      => [
                'message' => 'New order has been placed by :customer_name  with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'New order has been placed',
            ],
            'customer'   => [
                'message' => 'Your order has been placed successfully with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your order has been placed successfully',
            ],
            'storeOwner' => [
                'message' => 'Dear shop owner,New order has been placed by :customer_name with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'New order has been placed',
            ],
        ],
        'deliverOrder'        => [
            'admin'      => [
                'message' => 'Order has been delivered successfully  with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order has been delivered',
            ],
            'customer'   => [
                'message' => 'Your order has been delivered successfully with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your order has been delivered successfully',
            ],
            'storeOwner' => [
                'message' => 'Dear shop owner,Order has been delivered successfully with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order has been delivered',
            ],

        ],
        'statusChangeOrder'   => [
            'admin'      => [
                'message' => 'Order status has been changed to :order_status  with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order status has been changed',
            ],
            'customer'   => [
                'message' => 'Your order status has been changed to :order_status with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your order status has been changed',
            ],
            'storeOwner' => [
                'message' => 'Dear shop owner,Order status has been changed to :order_status with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order status has been changed',
            ],
        ],
        'paymentSuccessOrder' => [
            'admin'      => [
                'message' => 'Order payment has been successful with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order payment has been successful',
            ],
            'customer'   => [
                'message' => 'Your order payment has been successful with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your order payment has been successful',
            ],
            'storeOwner' => [
                'message' => 'Dear shop owner,Order payment has been successful with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order payment has been successful',
            ],
        ],
        'paymentFailedOrder'  => [
            'admin'      => [
                'message' => 'Order payment has been failed with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order payment has been failed',
            ],
            'customer'   => [
                'message' => 'Your order payment has been failed with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your order payment has been failed',
            ],
            'storeOwner' => [
                'message' => 'Dear shop owner,Order payment has been failed with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Order payment has been failed',
            ],
        ],
        'refundRequested'     => [
            'admin'    => [
                'message' => 'Customer has requested for refund with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Refund requested',
            ],
            'customer' => [
                'message' => 'Your refund request has been submitted successfully with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your refund request has been submitted successfully',
            ],
        ],
        'refundStatusChange' => [
            'admin'    => [
                'message' => 'Refund status has been changed to :refund_status with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Refund status has been changed',
            ],
            'customer' => [
                'message' => 'Your refund status has been changed to :refund_status with order tracking number :ORDER_TRACKING_NUMBER',
                'subject' => 'Your refund status has been changed',
            ],
        ],
    ]
];
