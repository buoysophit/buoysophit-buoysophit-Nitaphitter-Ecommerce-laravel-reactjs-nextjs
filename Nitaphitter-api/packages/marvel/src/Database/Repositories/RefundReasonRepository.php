<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\RefundReason;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Illuminate\Http\Request;



class RefundReasonRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
    ];

    protected $dataArray = [
        'name',
        'slug',
        'language',
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
            //
        }
    }


    /**
     * Configure the Model
     **/
    public function model()
    {
        return RefundReason::class;
    }

    public function storeRefundReason(Request $request)
    {
        $data = $request->only($this->dataArray);
        $data['slug'] = $this->makeSlug($request);
        $refundReason = $this->create($data);
        return $refundReason;
    }

    public function updateRefundReason($request, $item)
    {
        $data = $request->only($this->dataArray);
        if (!empty($request->slug) &&  $request->slug != $item['slug']) {
            $data['slug'] = $this->makeSlug($request);
        }
        $item->update($data);
        return $this->findOrFail($item->id);
    }
}
