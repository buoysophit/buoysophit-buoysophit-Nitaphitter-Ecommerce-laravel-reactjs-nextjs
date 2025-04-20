<?php

namespace Marvel\Database\Repositories;

use App\Events\ReviewCreated;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\NotifyLogs;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Stevebauman\Purify\Facades\Purify;


class NotifyLogsRepository extends BaseRepository
{

    protected $fieldSearchable = [
        'notify_type' => 'like',
        'language',
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }


    /**
     * Configure the Model
     **/
    public function model()
    {
        return NotifyLogs::class;
    }
}
