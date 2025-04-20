<?php

namespace Marvel\Database\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Shop extends Model
{
    use Sluggable;

    protected $table = 'shops';

    public $guarded = [];

    protected $casts = [
        'logo' => 'json',
        'cover_image' => 'json',
        'address' => 'json',
        'settings' => 'json',
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
                'source' => 'name'
            ]
        ];
    }

    /**
     * @return HasOne
     */
    public function balance(): HasOne
    {
        return $this->hasOne(Balance::class, 'shop_id');
    }

    /**
     * @return BelongsTo
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'shop_id');
    }

    /**
     * @return HasMany
     */
    public function attributes(): HasMany
    {
        return $this->hasMany(Attribute::class, 'shop_id');
    }

    /**
     * @return HasMany
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'shop_id');
    }

    /**
     * @return HasMany
     */
    public function withdraws(): HasMany
    {
        return $this->hasMany(Withdraw::class, 'shop_id');
    }

    /**
     * @return HasMany
     */
    public function staffs(): HasMany
    {
        return $this->hasMany(User::class, 'shop_id');
    }

    /**
     * @return HasMany
     */
    public function refunds(): HasMany
    {
        return $this->hasMany(User::class, 'shop_id');
    }

    /**
     * @return BelongsToMany
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_shop');
    }

    /**
     * @return BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->BelongsToMany(User::class, 'user_shop');
    }

    /**
     * @return HasMany
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'shop_id');
    }

    /**
     * faqs
     *
     * @return HasMany
     */
    public function faqs(): HasMany
    {
        return $this->HasMany(Faqs::class);
    }

    /**
     * terms and conditions
     *
     * @return HasMany
     */
    public function terms_and_conditions(): HasMany
    {
        return $this->HasMany(TermsAndConditions::class);
    }
    /**
     * faqs
     *
     * @return HasMany
     */
    public function coupons(): HasMany
    {
        return $this->HasMany(Coupon::class);
    }
    /**
     * ownership transfers
     *
     * @return HasOne
     */
    public function ownership_history(): HasOne
    {
        return $this->hasOne(OwnershipTransfer::class, 'shop_id');
    }
}
