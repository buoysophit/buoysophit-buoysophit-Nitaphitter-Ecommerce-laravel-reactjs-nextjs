<?php
return [
    'cancelOrder'       => [
        'admin'              => [
            'message' => 'Order has been cancelled  with order tracking number :tracking_number',
            'subject' => 'Order has been cancelled',
        ],
        'customer'           => [
            'message' => 'Your order has been  cancelled and  tracking number :tracking_number',
            'subject' => 'Your order has been cancelled',
        ],
        'storeOwner'         => [
            'message' => 'Dear shop owner,Order has been cancelled  with order tracking number :tracking_number',
            'subject' => 'Order has been cancelled',
        ],
        'childOrderCustomer' => [
            'message' => 'Dear shop owner,Order has been cancelled  with order tracking number :tracking_number',
            'subject' => 'Order has been cancelled',
        ],
    ],
    'orderCreated'      => [
        'admin'              => [
            'message' => 'New order has been placed by :customer_name  with order tracking number :tracking_number',
            'subject' => 'New order has been placed',
        ],
        'customer'           => [
            'message' => 'Your order has been placed successfully with order tracking number :tracking_number',
            'subject' => 'Your order has been placed successfully',
        ],
        'storeOwner'         => [
            'message' => 'Dear shop owner,New order has been placed by :customer_name with order tracking number :tracking_number',
            'subject' => 'New order has been placed',
        ],
        'childOrderCustomer' => [
            'message' => 'Dear shop owner,New order has been placed by :customer_name with order tracking number :tracking_number',
            'subject' => 'New order has been placed',
        ],
    ],
    'deliverOrder'      => [
        'admin'              => [
            'message' => 'Order has been delivered by :customer_name  with order tracking number :tracking_number',
            'subject' => 'Order has been delivered',
        ],
        'customer'           => [
            'message' => 'Your order has been delivered successfully with order tracking number :tracking_number',
            'subject' => 'Your order has been delivered successfully',
        ],
        'storeOwner'         => [
            'message' => 'Dear shop owner,Order has been delivered by :customer_name with order tracking number :tracking_number',
            'subject' => 'Order has been delivered',
        ],
        'childOrderCustomer' => [
            'message' => 'Dear shop owner,Order has been delivered by :customer_name with order tracking number :tracking_number',
            'subject' => 'Order has been delivered',
        ],
    ],
    'statusChangeOrder' => [
        'admin'              => [
            'message' => 'Order status has been changed by :customer_name  with order tracking number :tracking_number',
            'subject' => 'Order status has been changed',
        ],
        'customer'           => [
            'message' => 'Your order status has been changed successfully with order tracking number :tracking_number',
            'subject' => 'Your order status has been changed successfully',
        ],
        'storeOwner'         => [
            'message' => 'Dear shop owner,Order status has been changed by :customer_name with order tracking number :tracking_number',
            'subject' => 'Order status has been changed',
        ],
        'childOrderCustomer' => [
            'message' => 'Dear shop owner,Order status has been changed by :customer_name with order tracking number :tracking_number',
            'subject' => 'Order status has been changed',
        ],
    ],

];
