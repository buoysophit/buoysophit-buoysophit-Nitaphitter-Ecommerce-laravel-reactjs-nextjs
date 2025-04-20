<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Marvel\Traits\TranslationTrait;

class NotifyLogs extends Model
{
    use SoftDeletes;
    use TranslationTrait;


    protected $table = 'notify_logs';

    public $guarded = [];

    protected $hidden = [
        'updated_at',
        'deleted_at'
    ];

    /**
     * @return BelongsTo
     */
    public function receiver_user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver')->with('profile');
    }


    /**
     * @return BelongsTo
     */
    public function sender_user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender')->with('profile');
    }
}
