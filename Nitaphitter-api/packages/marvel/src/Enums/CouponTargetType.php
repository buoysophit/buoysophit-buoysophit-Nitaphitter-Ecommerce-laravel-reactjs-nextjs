<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class RoleType
 * @package App\Enums
 */
final class CouponTargetType extends Enum
{
    public const GLOBAL_CUSTOMER = 'global_customer';
    public const VERIFIED_CUSTOMER = 'verified_customer';
}
