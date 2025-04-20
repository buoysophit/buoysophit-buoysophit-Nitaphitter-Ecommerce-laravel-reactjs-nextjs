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
use Marvel\Database\Repositories\ProductRepository;

class FlashSaleController extends CoreController
{
    public $repository;

    public $productRepository;

    public function __construct(FlashSaleRepository $repository, ProductRepository $productRepository)
    {
        $this->repository = $repository;
        $this->productRepository = $productRepository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|FlashSale[]
     */
    public function index(Request $request)
    {
        try {
            $limit = $request->limit ? $request->limit : 10;
            return $this->fetchFlashSales($request)->paginate($limit)->withQueryString();
            // $data = FlashSaleResource::collection($flash_sales)->response()->getData(true);
            // return formatAPIResourcePaginate($data);
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    public function fetchFlashSales(Request $request)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        event(new FlashSaleProcessed('index', $language));

        $flash_sales_query = $this->repository->where('language', $language)
            ->when($request->request_from === 'vendor', function ($flash_sales_query) {
                return $flash_sales_query->whereDate('start_date', '>', now()->toDateString());
            });

        return $flash_sales_query;
    }

    /**
     * Store a newly created faq in storage.
     *
     * @param CreateFlashSaleRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(CreateFlashSaleRequest $request)
    {
        try {
            return $this->repository->storeFlashSale($request);
            // return $this->repository->create($validatedData);
        } catch (MarvelException $e) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE, $e->getMessage());
        }
    }

    /**
     * Display the specified flash sale.
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show(Request $request, $slug)
    {
        try {
            $language = $request->language ?? DEFAULT_LANGUAGE;
            return $this->repository->where('language', $language)->where('slug', '=', $slug)->first();
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND, $e->getMessage());
        }
    }


    /**
     * Update the specified flash sale
     *
     * @param UpdateFlashSaleRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateFlashSaleRequest $request, $id)
    {
        try {
            $request->merge(['id' => $id]);
            return $this->updateFlashSale($request);
        } catch (MarvelException $e) {
            throw new MarvelException(COULD_NOT_UPDATE_THE_RESOURCE, $e->getMessage());
        }
    }

    /**
     * updateFlashSale
     *
     * @param  Request $request
     * @return void
     */
    public function updateFlashSale(Request $request)
    {
        // $flash_sale_id = $this->repository->findOrFail($request['id']);
        // return $this->repository->updateFlashSale($request, $flash_sale_id);

        $id = $request->id;
        return $this->repository->updateFlashSale($request, $id);
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
        return $this->deleteFlashSale($request);
    }

    public function deleteFlashSale(Request $request)
    {
        try {
            $user = $request->user();
            if ($user && ($user->hasPermissionTo(Permission::SUPER_ADMIN) || $user->hasPermissionTo(Permission::STORE_OWNER) || $user->hasPermissionTo(Permission::STAFF))) {
                $flashSale = $this->repository->findOrFail($request->id);
                $flashSale->delete();
                return $flashSale;
            }
            throw new AuthorizationException(NOT_AUTHORIZED);
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND, $e->getMessage());
        }
    }

    /**
     * getFlashSaleInfoByProductID
     *
     * @param  Request $request
     * @return void
     */
    public function getFlashSaleInfoByProductID(Request $request)
    {
        try {
            $flash_sale_info = [];
            $product = Product::find($request->id);

            if ($product) {
                $flash_sale_info = $product->flash_sales;
            }

            return $flash_sale_info;
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    /**
     * getProductsByFlashSale
     *
     * @param  Request $request
     * @return void
     */
    public function getProductsByFlashSale(Request $request)
    {
        $limit = $request->limit ? $request->limit : 10;
        return $this->fetchProductsByFlashSale($request)->paginate($limit)->withQueryString();
    }

    /**
     * fetchProductsByFlashSale
     *
     * @param  Request $request
     * @return object
     */
    public function fetchProductsByFlashSale(Request $request)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;

        $product_ids = $this->repository->join('flash_sale_products', 'flash_sales.id', '=', 'flash_sale_products.flash_sale_id')
            ->join('products', 'flash_sale_products.product_id', '=', 'products.id')
            ->where('flash_sales.slug', '=', $request->slug)
            ->where('flash_sales.language', '=', $language)
            ->select('products.id')
            ->pluck('id'); // You can set your desired limit here (e.g., 10 products per page)

        return $this->productRepository->whereIn('id', $product_ids);
    }
}
