<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlashSaleRequests extends Model
{
    use SoftDeletes;

    protected $table = 'flash_sale_requests';

    public $guarded = [];

    /**
     * @return BelongsTo
     */
    public function flash_sale(): BelongsTo
    {
        return $this->belongsTo(FlashSale::class, 'flash_sale_id');
    }

    /**
     * products
     *
     * @return BelongsToMany
     */
    public function  products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, "flash_sale_requests_products");
    }
}
