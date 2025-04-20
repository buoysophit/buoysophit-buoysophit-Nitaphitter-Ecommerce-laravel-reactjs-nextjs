<?php


namespace Marvel\Database\Repositories;

use Exception;
use Marvel\Database\Models\FlashSale;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Marvel\Database\Models\FlashSaleRequests;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Marvel\Events\FlashSaleProcessed;

class FlashSaleVendorRequestRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'title' => 'like',
        'request_status',
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'language',
        'title',
        'note',
        'flash_sale_id'
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
        return FlashSaleRequests::class;
    }


    /**
     * storeFlashSaleRequest
     *
     * @param  mixed $request
     * @return void
     */
    public function storeFlashSaleRequest($request)
    {
        try {

            $data = $request->only($this->dataArray);
            $data['request_status'] = false;
            $flash_sale_request = $this->create($data);
            if (isset($request['requested_product_ids'])) {
                $flash_sale_request->products()->attach($request['requested_product_ids']);
            }
            return $flash_sale_request;
        } catch (Exception $th) {
            throw new Exception(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }


    public function updateFlashSaleRequest($request, $id)
    {
        try {
            $flash_sale_request = $this->findOrFail($id);

            $data = $request->only($this->dataArray);
            $data['request_status'] = false;
            if (isset($request['requested_product_ids'])) {
                $flash_sale_request->products()->sync($request['requested_product_ids']);
            }

            // if ($flash_sale_request['sale_builder']['product_ids'] != $request['sale_builder']['product_ids']) {
            //     $this->unsetProductFromFlashSale($flash_sale_request['sale_builder']['product_ids'], $request['sale_builder']['product_ids']);
            // }

            $flash_sale_request->update($data);
            return $flash_sale_request;
        } catch (Exception $e) {
            throw new Exception(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }


    /**
     * approveFlashSaleVendorRequestFunc
     *
     * @param  string $id
     * @return void
     */
    public function approveFlashSaleVendorRequestFunc($id)
    {
        try {
            $flash_sale_request = $this->findOrFail($id);
        } catch (\Exception $e) {
            throw new ModelNotFoundException(NOT_FOUND);
        }
        $flash_sale_request->request_status = true;
        $products = $flash_sale_request->products;
        // $flash_sale =  FlashSale::where("id", "=", $flash_sale_request->flash_sale_id)->with('products')->first();


        $attached_products_array = [];

        if (isset($products)) {
            $flash_sale =  FlashSale::with('products')->findOrFail($flash_sale_request->flash_sale_id);
            foreach ($products as $product) {
                // Create a new record in the flash_sale_product pivot table
                if (!in_array($product->id, $flash_sale->products->pluck('id')->toArray())) {
                    $flash_sale->products()->attach($flash_sale_request->flash_sale_id, ['product_id' => $product->id]);
                }
                array_push($attached_products_array, $product->id);
            }
        }



        $flash_sale_request->save();

        $prepare_flash_sale_data = [
            'attached_product_ids' => $attached_products_array,
            'requested_flash_sale' => $flash_sale
        ];

        event(new FlashSaleProcessed('append_attached_products', DEFAULT_LANGUAGE, $prepare_flash_sale_data));

        return $flash_sale_request;
    }


    /**
     * disapproveFlashSaleVendorRequestFunc
     *
     * @param  string $id
     * @return void
     */
    public function disapproveFlashSaleVendorRequestFunc($id)
    {
        try {
            $flash_sale_request = $this->findOrFail($id);
        } catch (\Exception $e) {
            throw new ModelNotFoundException(NOT_FOUND);
        }

        $flash_sale_request->request_status = false;
        $products = $flash_sale_request->products;
        // $flash_sale =  FlashSale::where("id", "=", $flash_sale_request->flash_sale_id)->with('products')->first();


        $detached_products_array = [];

        if (isset($products)) {
            // $flash_sale =  FlashSale::with('products')->findOrFail($flash_sale_request->flash_sale_id);
            $flash_sale =  FlashSale::with('products')->where("id", "=", $flash_sale_request->flash_sale_id)->first();
            foreach ($products as $product) {
                // Create a new record in the flash_sale_product pivot table
                if (in_array($product->id, $flash_sale->products->pluck('id')->toArray())) {
                    $flash_sale->products()->detach($product->id);
                }
                array_push($detached_products_array, $product->id);
            }

            $flash_sale->save();
        }


        $flash_sale_request->save();

        $prepare_flash_sale_data = [
            'detached_product_ids' => $detached_products_array,
            'requested_flash_sale' => $flash_sale
        ];

        event(new FlashSaleProcessed('remove_attached_products', DEFAULT_LANGUAGE, $prepare_flash_sale_data));


        // $flash_sale_request->save();
        return $flash_sale_request;
    }
}
