<?php


namespace Marvel\Database\Repositories;

use Exception;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Illuminate\Http\Request;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\TermsAndConditions;

class TermsAndConditionsRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'title' => 'like',
        'shop_id',
        'language',
        'type',
        'issued_by',
        'is_approved'
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'title',
        'description',
        'language',
        'slug',
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
        return TermsAndConditions::class;
    }



    /**
     * storeTermsAndConditions
     *
     * @param  mixed $request
     * @return void
     */
    public function storeTermsAndConditions($request)
    {
        try {
            if (isset($request['shop_id']) && !empty($request['shop_id'])) {
                // $shop = Shop::where('id', '=', $request['shop_id'])->first();
                $shop = Shop::findOrFail($request['shop_id']);
            }

            $termsAndConditions                = [];
            $termsAndConditions['title']       = $request['title'];
            $termsAndConditions['description'] = $request['description'];
            $termsAndConditions['user_id']     = $request->user()->id;
            $termsAndConditions['shop_id']     = isset($request['shop_id']) ? $request['shop_id'] : null;
            $termsAndConditions['type']        = isset($request['shop_id']) ? 'shop' : 'global';
            $termsAndConditions['issued_by']   = isset($request['shop_id']) && isset($shop) ? $shop->name : 'Super Admin';
            $termsAndConditions['language']    = $request['language'] ?? DEFAULT_LANGUAGE;
            $termsAndConditions['is_approved'] = isset($request['shop_id']) && isset($shop) ? false : true;

            $this->create($termsAndConditions);
            return $termsAndConditions;
        } catch (Exception $th) {
            throw new Exception(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }


    /**
     * updateTermsAndConditions
     *
     * @param  mixed $request
     * @param  mixed $termsAndConditions
     * @return void
     */
    public function updateTermsAndConditions(Request $request, TermsAndConditions $termsAndConditions)
    {
        try {
            $termsAndConditions->update($request->only($this->dataArray));
            return $termsAndConditions;
        } catch (Exception $e) {
            throw new Exception(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }
}
