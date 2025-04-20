<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class RoleType
 * @package App\Enums
 */
final class EventType extends Enum
{
    public const ORDER_CANCELLED       = 'cancelOrder';
    public const ORDER_CREATED         = 'createOrder';
    public const ORDER_DELIVERED       = 'deliverOrder';
    public const ORDER_PAYMENT         = 'paymentOrder';
    public const ORDER_PAYMENT_FAILED  = 'paymentFailedOrder';
    public const ORDER_PAYMENT_SUCCESS = 'paymentSuccessOrder';
    public const ORDER_REFUND          = 'refundOrder';
    public const ORDER_STATUS_CHANGED  = 'statusChangeOrder';
    public const ORDER_UPDATED         = 'updateOrder';
    public const QUESTION_ANSWERED     = 'answerQuestion';
    public const QUESTION_CREATED      = 'createQuestion';
    public const REVIEW_CREATED        = 'createReview';

}