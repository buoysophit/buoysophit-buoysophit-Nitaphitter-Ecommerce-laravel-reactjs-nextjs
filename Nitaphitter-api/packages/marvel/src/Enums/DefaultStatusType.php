<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class RoleType
 * @package App\Enums
 */
final class DefaultStatusType extends Enum
{
    public const PROCESSING = 'processing';
    public const APPROVED = 'approved';
    public const PENDING = 'pending';
    public const REJECTED = 'rejected';
}
