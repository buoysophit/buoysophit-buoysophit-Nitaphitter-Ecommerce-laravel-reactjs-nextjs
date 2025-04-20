<?php


namespace Marvel\Database\Repositories;

use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Illuminate\Http\Request;
use Marvel\Database\Models\FlashSale;
use Marvel\Database\Models\Product;
use Marvel\Enums\Permission;

class FlashSaleRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'title' => 'like',
        'language',
        'slug'
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'title',
        'description',
        'start_date',
        'end_date',
        'language',
        'slug',
        'image',
        'cover_image',
        'rate',
        'type',
        'sale_status',
        'sale_builder'
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
        return FlashSale::class;
    }



    /**
     * storeFlashSale
     *
     * @param  mixed $request
     * @return void
     */
    public function storeFlashSale($request)
    {
        try {
            // only admin can create flash deals
            if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                $data = $request->only($this->dataArray);
                $flash_sale = $this->create($data);
                if (isset($request['sale_builder']['product_ids'])) {
                    $flash_sale->products()->attach($request['sale_builder']['product_ids']);
                    $this->setProductInFlashSale($request['sale_builder']['product_ids']);
                }
                return $flash_sale;
            }

            throw new AuthorizationException(NOT_AUTHORIZED);
        } catch (Exception $th) {
            throw new Exception(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }


    /**
     * updateFlashSale 
     *
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function updateFlashSale(Request $request, $id)
    {
        try {
            // only admin can update flash deals
            if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                $flash_sale = $this->findOrFail($id);

                $data = $request->only($this->dataArray);
                if (isset($request['sale_builder']['product_ids'])) {
                    $flash_sale->products()->sync($request['sale_builder']['product_ids']);
                    $this->setProductInFlashSale($request['sale_builder']['product_ids']);
                }

                if ($flash_sale['sale_builder']['product_ids'] != $request['sale_builder']['product_ids']) {
                    $this->unsetProductFromFlashSale($flash_sale['sale_builder']['product_ids'], $request['sale_builder']['product_ids']);
                }

                $flash_sale->update($data);
                return $flash_sale;
            }

            throw new AuthorizationException(NOT_AUTHORIZED);
        } catch (Exception $e) {
            throw new Exception(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    /**
     * setProductInFlashSale
     *
     * @param  array $product_ids
     * @return void
     */
    public function setProductInFlashSale($product_ids)
    {
        foreach ($product_ids as $key => $product_id) {
            $product = Product::findOrFail($product_id);
            $product->in_flash_sale = true;
            $product->save();
        }
    }


    /**
     * unsetProductFromFlashSale
     *
     * @param  array $previous_list
     * @param  array $new_list
     * @return void
     */
    public function unsetProductFromFlashSale($previous_list, $new_list)
    {
        $final_list = array_diff($previous_list, $new_list);

        if (isset($final_list)) {
            foreach ($final_list as $key => $product_id) {
                $product = Product::findOrFail($product_id);
                $product->in_flash_sale = false;
                $product->save();
            }
        }
    }
}
