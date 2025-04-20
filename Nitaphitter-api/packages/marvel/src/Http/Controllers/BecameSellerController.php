<?php

namespace Marvel\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\Address;
use Marvel\Database\Repositories\BecameSellersRepository;
use Marvel\Exceptions\MarvelException;
use Illuminate\Support\Facades\Cache;
use Marvel\Database\Models\Commission;
use Marvel\Database\Repositories\CommissionRepository;
use Marvel\Http\Requests\BecameSellersRequest;
use Marvel\Http\Requests\CommissionRequest;
use Prettus\Validator\Exceptions\ValidatorException;

class BecameSellerController extends CoreController
{
    public $repository;
    public $commission;

    public function __construct(BecameSellersRepository $repository, CommissionRepository $commission)
    {
        $this->repository = $repository;
        $this->commission = $commission;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Address[]
     */
    public function index(Request $request)
    {
        $language = $request->language ? $request->language : DEFAULT_LANGUAGE;
        return Cache::rememberForever(
            'cached_became_seller_' . $language,
            function () use ($request) {
                return [
                    'page_options' => $this->repository->getData($request->language),
                    'commissions' => $this->commission->get()
                ];
            }
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param BecameSellersRequest $request
     * @return mixed
     * @throws ValidatorException
     */

    public function store(BecameSellersRequest $request)
    {
        $language = $request->language ? $request->language : DEFAULT_LANGUAGE;
        if (Cache::has('cached_became_seller_' . $language)) {
            Cache::forget('cached_became_seller_' . $language);
        }

        $request->merge([
            'page_options' => [
                ...$request->page_options,
            ]
        ]);
        
        $this->commission->storeCommission($request['commissions'], $language);

        $data = $this->repository->where('language', $request->language)->first();
        if ($data) {
            
            $becomeSeller =  tap($data)->update($request->only(['page_options']));
        } else {
            $becomeSeller =  $this->repository->create(['page_options' => $request['page_options'], 'language' => $language]);
        }
        return $becomeSeller;
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            return $this->repository->first();
        } catch (\Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param BecameSellersRequest $request
     * @param int $id
     * @return JsonResponse
     * @throws ValidatorException
     */
    public function update(BecameSellersRequest $request, $id)
    {
        $settings = $this->repository->first();
        if (isset($settings->id)) {
            return $this->repository->update($request->only(['page_options']), $settings->id);
        } else {
            return $this->repository->create(['page_options' => $request['page_options']]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return array
     */
    public function destroy($id)
    {
        throw new MarvelException(ACTION_NOT_VALID);
    }
}
