<?php


namespace Marvel\Database\Repositories;

use Illuminate\Http\Request;
use Marvel\Database\Models\RefundPolicy;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class RefundPolicyRepository extends BaseRepository
{


    protected $fieldSearchable = [
        'title' => 'like',
        'slug' => 'like',
        'target',
        'status',
        'shop_id',
        'description' => 'like',
        'shop.slug',
    ];

    protected $dataArray = [
        'title',
        'slug',
        'target',
        'status',
        'description',
        'shop_id',
        'language',
    ];
    /**
     * Configure the Model
     **/
    public function model()
    {
        return RefundPolicy::class;
    }

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }

    public function storeRefundPolicy(Request $request)
    {
        $data = $request->only($this->dataArray);
        $data['slug'] = $this->makeSlug($request);
        $refundPolicy = $this->create($data);
        return $refundPolicy;
    }

    public function updateRefundPolicy(Request $request, RefundPolicy $refundPolicy)
    {
        $data = $request->only($this->dataArray);
        $data['slug'] = $this->makeSlug(request: $request, update: $refundPolicy->id);
        $refundPolicy->update($data);
        return $refundPolicy;
    }

    public function findRefundPolicy(int | string $value, string $language = DEFAULT_LANGUAGE): RefundPolicy
    {
        return match (true) {
            is_numeric($value) => $this->where('id', $value)->where('language', $language)->firstOrFail(),
            is_string($value)  => $this->where('slug', $value)->where('language', $language)->firstOrFail(),
        };
    }
}
