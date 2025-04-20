<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commission extends Model
{
    protected $table = 'commissions';

    public $guarded = [];

    protected $casts = [
        'image' => 'json',
    ];
}
