<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class ProductVisibilityStatus
 */
final class ProductVisibilityStatus extends Enum
{
    public const VISIBILITY_PRIVATE = 'visibility_private';
    public const VISIBILITY_PUBLIC = 'visibility_public';
    public const VISIBILITY_PROTECTED = 'visibility_protected';
}
