<?php

namespace Marvel\Http\Controllers;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\FlashSale;
use Marvel\Database\Models\Product;
use Marvel\Database\Repositories\FlashSaleRepository;
use Marvel\Enums\Permission;
use Marvel\Events\FlashSaleProcessed;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\CreateFlashSaleRequest;
use Marvel\Http\Requests\UpdateFlashSaleRequest;
use Prettus\Validator\Exceptions\ValidatorException;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\FlashSaleRequests;
use Marvel\Database\Repositories\FlashSaleVendorRequestRepository;
use Marvel\Http\Requests\CreateVendorFlashSaleRequest;
use Marvel\Http\Requests\UpdateVendorFlashSaleRequest;
use Marvel\Http\Resources\FlashSaleResource;
use Marvel\Database\Repositories\ProductRepository;



class FlashSaleVendorRequestController extends CoreController
{
    public $repository;

    public $productRepository;

    public function __construct(FlashSaleVendorRequestRepository $repository, ProductRepository $productRepository)
    {
        $this->repository = $repository;
        $this->productRepository = $productRepository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|FlashSaleRequests[]
     */
    public function index(Request $request)
    {
        try {
            $limit = $request->limit ? $request->limit : 10;
            return $this->fetchFlashSalesRequests($request)->paginate($limit)->withQueryString();
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    /**
     * fetchFlashSalesRequests
     *
     * @param  Request $request
     * @return object
     */
    public function fetchFlashSalesRequests(Request $request)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        // event(new FlashSaleProcessed('index', $language));
        return $this->repository->where('language', $language);
    }

    /**
     * Store a newly created faq in storage.
     *
     * @param CreateVendorFlashSaleRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(CreateVendorFlashSaleRequest $request)
    {
        try {
            return $this->repository->storeFlashSaleRequest($request);
        } catch (MarvelException $e) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE, $e->getMessage());
        }
    }

    /**
     * Display the specified flash sale.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(Request $request, $id)
    {
        try {
            $language = $request->language ?? DEFAULT_LANGUAGE;
            return $this->repository->where('language', $language)->where('id', '=', $id)->first();
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND, $e->getMessage());
        }
    }


    /**
     * Update the specified flash sale
     *
     * @param UpdateVendorFlashSaleRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateVendorFlashSaleRequest $request, $id)
    {
        try {
            $request->merge(['id' => $id]);
            return $this->updateFlashSaleRequest($request);
        } catch (MarvelException $e) {
            throw new MarvelException(COULD_NOT_UPDATE_THE_RESOURCE, $e->getMessage());
        }
    }

    /**
     * updateFlashSaleRequest
     *
     * @param  Request $request
     * @return void
     */
    public function updateFlashSaleRequest(Request $request)
    {
        $id = $request->id;
        return $this->repository->updateFlashSaleRequest($request, $id);
    }

    /**
     * Remove the specified flash sale
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy($id, Request $request)
    {
        $request->merge(['id' => $id]);
        return $this->deleteFlashSaleRequest($request);
    }

    public function deleteFlashSaleRequest(Request $request)
    {
        try {
            $user = $request->user();
            if ($user && ($user->hasPermissionTo(Permission::SUPER_ADMIN) || $user->hasPermissionTo(Permission::STORE_OWNER) || $user->hasPermissionTo(Permission::STAFF))) {

                $flash_sale_request = $this->repository->findOrFail($request->id);
                $requested_products = $flash_sale_request->products;

                $detached_products_array = [];

                if (isset($requested_products)) {
                    // $flash_sale = FlashSale::with('products')->findOrFail($flash_sale_request->flash_sale_id);
                    $flash_sale = FlashSale::with('products')->where("id", "=", $flash_sale_request->flash_sale_id)->first();

                    foreach ($requested_products as $product) {
                        // detach requested products from flash_sale_products pivot table.
                        if (in_array($product->id, $flash_sale->products->pluck('id')->toArray())) {
                            $flash_sale->products()->detach($product->id);
                        }
                        array_push($detached_products_array, $product->id);
                    }
                    $flash_sale->save();
                }

                $prepare_event_data = [
                    'requested_flash_sale' => $flash_sale,
                    'detached_products' => $detached_products_array
                ];
                event(new FlashSaleProcessed('delete_vendor_request', DEFAULT_LANGUAGE, $prepare_event_data));

                $flash_sale_request->forceDelete();
                return $flash_sale_request;
            }
            throw new AuthorizationException(NOT_AUTHORIZED);
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND, $e->getMessage());
        }
    }

    /**
     * approveFlashSaleProductsRequest
     *
     * @param  Request $request
     * @return void
     */
    public function approveFlashSaleProductsRequest(Request $request)
    {
        try {
            if (!$request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                throw new MarvelException(NOT_AUTHORIZED);
            }
            $id = $request->id;
            $this->repository->approveFlashSaleVendorRequestFunc($id);
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    /**
     * disapproveFlashSaleProductsRequest
     *
     * @param  Request $request
     * @return void
     */
    public function disapproveFlashSaleProductsRequest(Request $request)
    {
        try {
            if (!$request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                throw new MarvelException(NOT_AUTHORIZED);
            }
            $id = $request->id;
            $this->repository->disapproveFlashSaleVendorRequestFunc($id);
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }


    /**
     * getRequestedProductsForFlashSale
     *
     * @param  Request $request
     * @return object
     */
    public function getRequestedProductsForFlashSale(Request $request)
    {
        try {
            $limit = $request->limit ? $request->limit : 10;
            return $this->fetchRequestedProducts($request)->paginate($limit)->withQueryString();
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    /**
     * fetchRequestedProducts
     *
     * @param  Request $request
     * @return object
     */
    public function fetchRequestedProducts(Request $request)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        $product_ids = $this->repository
            ->join('flash_sale_requests_products', 'flash_sale_requests.id', '=', 'flash_sale_requests_products.flash_sale_requests_id')
            ->join('products', 'flash_sale_requests_products.product_id', '=', 'products.id')
            ->where('flash_sale_requests.id', '=', $request->vendor_request_id)
            ->where('flash_sale_requests.language', '=', $language)
            ->select('products.id')
            ->pluck('id'); // You can set your desired limit here (e.g., 10 products per page)

        return $this->productRepository->whereIn('id', $product_ids);
    }
}
