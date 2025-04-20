<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class ProductStatus
 * @package App\Enums
 */
final class ProductStatus extends Enum
{
	public const UNDER_REVIEW = 'under_review';
	public const APPROVED = 'approved';
	public const REJECTED = 'rejected';
	public const PUBLISH = 'publish';
	public const UNPUBLISH = 'unpublish';
	public const DRAFT = 'draft';
}
