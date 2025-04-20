<?php
return [
    //translate to german
    'order' => [
        'cancelOrder'         => [
            'admin'      => [
                'message' => 'Die Bestellung wurde mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER storniert',
                'subject' => 'Bestellung wurde storniert',
            ],
            'customer'   => [
                'message' => 'Die Bestellung wurde mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER storniert',
                'subject' => 'Bestellung wurde storniert',
            ],
            'storeOwner' => [
                'message' => 'Sehr geehrter Shop-Inhaber, die Bestellung wurde mit der Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER storniert',
                'subject' => 'Bestellung wurde storniert',
            ],
        ],
        'orderCreated'        => [
            'admin'      => [
                'message' => 'Eine neue Bestellung wurde von :customer_name mit der Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER aufgegeben',
                'subject' => 'Neue Bestellung wurde aufgegeben',
            ],
            'customer'   => [
                'message' => 'Ihre Bestellung wurde erfolgreich mit der Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER aufgegeben',
                'subject' => 'Ihre Bestellung wurde erfolgreich aufgegeben',
            ],
            'storeOwner' => [
                'message' => 'Sehr geehrter Shop-Inhaber, eine neue Bestellung wurde von :customer_name mit Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER aufgegeben',
                'subject' => 'Neue Bestellung wurde aufgegeben',
            ],
        ],
        'deliverOrder'        => [
            'admin'      => [
                'message' => 'Die Bestellung wurde mit der Sendungsverfolgungsnummer :ORDER_TRACKING_NUMBER geliefert',
                'subject' => 'Bestellung wurde geliefert',
            ],
            'customer'   => [
                'message' => 'Ihre Bestellung wurde erfolgreich mit der Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER geliefert',
                'subject' => 'Ihre Bestellung wurde erfolgreich geliefert',
            ],
            'storeOwner' => [
                'message' => 'Sehr geehrter Shop-Inhaber, die Bestellung wurde erfolgreich mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER geliefert',
                'subject' => 'Bestellung wurde geliefert',
            ],

        ],
        'statusChangeOrder'   => [
            'admin'      => [
                'message' => 'Der Bestellstatus wurde in :order_status mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER geändert',
                'subject' => 'Bestellstatus wurde geändert',
            ],
            'customer'   => [
                'message' => 'Ihr Bestellstatus wurde in :order_status mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER geändert',
                'subject' => 'Ihr Bestellstatus wurde geändert',
            ],
            'storeOwner' => [
                'message' => 'Sehr geehrter Shop-Inhaber, der Bestellstatus wurde in :order_status mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER geändert',
                'subject' => 'Bestellstatus wurde geändert',
            ],
        ],
        'paymentSuccessOrder' => [
            'admin'      => [
                'message' => 'Die Zahlung der Bestellung war erfolgreich mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER',
                'subject' => 'Die Zahlung der Bestellung war erfolgreich',
            ],
            'customer'   => [
                'message' => 'Ihre Bestellung wurde mit der Sendungsverfolgungsnummer :ORDER_TRACKING_NUMBER erfolgreich bezahlt',
                'subject' => 'Die Zahlung Ihrer Bestellung war erfolgreich',
            ],
            'storeOwner' => [
                'message' => 'Sehr geehrter Ladenbesitzer, die Zahlung der Bestellung war erfolgreich mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER',
                'subject' => 'Die Zahlung der Bestellung war erfolgreich',
            ],
        ],
        'paymentFailedOrder'  => [
            'admin'      => [
                'message' => 'Die Zahlung der Bestellung ist mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER fehlgeschlagen',
                'subject' => 'Die Zahlung der Bestellung ist fehlgeschlagen',
            ],
            'customer'   => [
                'message' => 'Die Zahlung der Bestellung ist mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER fehlgeschlagen',
                'subject' => 'Die Zahlung der Bestellung ist fehlgeschlagen',
            ],
            'storeOwner' => [
                'message' => 'Die Zahlung der Bestellung ist mit der Bestellverfolgungsnummer :ORDER_TRACKING_NUMBER fehlgeschlagen',
                'subject' => 'Die Zahlung der Bestellung ist fehlgeschlagen',
            ],
        ],
        'refundRequested'     => [
            'admin'    => [
                'message' => 'Der Kunde hat eine Rückerstattung mit der Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER angefordert',
                'subject' => 'Rückerstattung beantragt',
            ],
            'customer' => [
                'message' => 'Ihr Erstattungsantrag wurde erfolgreich mit der Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER gesendet',
                'subject' => 'Ihre Rückerstattungsanfrage wurde erfolgreich übermittelt',
            ],
        ],
        'refundStatusChange'  => [
            'admin'    => [
                'message' => 'Der Rückerstattungsstatus wurde in :refund_status mit Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER geändert',
                'subject' => 'Der Rückerstattungsstatus wurde geändert',
            ],
            'customer' => [
                'message' => 'Ihr Rückerstattungsstatus wurde in :refund_status mit Auftragsverfolgungsnummer :ORDER_TRACKING_NUMBER geändert',
                'subject' => 'Ihr Rückerstattungsstatus wurde geändert',
            ],
        ],
    ]
];
