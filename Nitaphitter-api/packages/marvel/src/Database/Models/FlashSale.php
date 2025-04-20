<?php

namespace Marvel\Database\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Marvel\Traits\TranslationTrait;

class FlashSale extends Model
{
    use TranslationTrait, SoftDeletes, Sluggable;

    protected $table = 'flash_sales';

    protected $appends = ['translated_languages'];

    public $guarded = [];

    protected $casts = [
        'cover_image'  => 'json',
        'sale_builder' => 'json',
        'image'        => 'json'
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
            ]
        ];
    }

    public function scopeWithUniqueSlugConstraints(Builder $query, Model $model): Builder
    {
        return $query->where('language', $model->language);
    }

    /**
     * @return BelongsToMany
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'flash_sale_products')->withPivot('flash_sale_id', 'product_id');
    }

    /**
     * @return HasMany
     */
    public function flashSaleRequests(): HasMany
    {
        return $this->hasMany(FlashSaleRequests::class);
    }
}