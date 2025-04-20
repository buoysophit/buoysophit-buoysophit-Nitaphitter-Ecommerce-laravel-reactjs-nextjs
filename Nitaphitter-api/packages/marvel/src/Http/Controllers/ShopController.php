<?php

namespace Marvel\Http\Controllers;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Marvel\Enums\Permission;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;
use Illuminate\Http\JsonResponse;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Product;
use Illuminate\Support\Facades\Hash;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\ShopCreateRequest;
use Marvel\Http\Requests\ShopUpdateRequest;
use Marvel\Http\Requests\TransferShopOwnerShipRequest;
use Marvel\Http\Requests\UserCreateRequest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\Settings;
use Marvel\Database\Repositories\ShopRepository;
use Marvel\Enums\Role;
use Marvel\Traits\OrderStatusManagerWithPaymentTrait;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ShopController extends CoreController
{
    use OrderStatusManagerWithPaymentTrait;
    public $repository;

    public function __construct(ShopRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Shop[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        return $this->fetchShops($request)->paginate($limit)->withQueryString();
    }

    public function fetchShops(Request $request)
    {
        return $this->repository->withCount(['orders', 'products'])->with(['owner.profile', 'ownership_history'])->where('id', '!=', null);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ShopCreateRequest $request
     * @return mixed
     */
    public function store(ShopCreateRequest $request)
    {
        try {
            if ($request->user()->hasPermissionTo(Permission::STORE_OWNER)) {
                return $this->repository->storeShop($request);
            }
            throw new AuthorizationException(NOT_AUTHORIZED);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return JsonResponse
     */
    public function show($slug, Request $request)
    {
        $shop = $this->repository
            ->with(['categories', 'owner', 'ownership_history'])
            ->withCount(['orders', 'products']);
        if ($request->user() && ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN) || $request->user()->shops->contains('slug', $slug))) {
            $shop = $shop->with('balance');
        }
        try {
            return match (true) {
                is_numeric($slug) => $shop->where('id', $slug)->firstOrFail(),
                is_string($slug)  => $shop->where('slug', $slug)->firstOrFail(),
            };
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ShopUpdateRequest $request
     * @param int $id
     * @return array
     */
    public function update(ShopUpdateRequest $request, $id)
    {
        try {
            $request->id = $id;
            return $this->updateShop($request);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_UPDATE_THE_RESOURCE);
        }
    }

    public function updateShop(Request $request)
    {
        $id = $request->id;
        if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN) || ($request->user()->hasPermissionTo(Permission::STORE_OWNER) && ($request->user()->shops->contains($id)))) {
            return $this->repository->updateShop($request, $id);
        }
        throw new AuthorizationException(NOT_AUTHORIZED);
    }

    public function shopMaintenanceEvent(Request $request) {
        try {
            $id = $request->shop_id;
            return $this->repository->maintenanceShopEvent($request, $id);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_UPDATE_THE_RESOURCE);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        try {
            $request->id = $id;
            return $this->deleteShop($request);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_DELETE_THE_RESOURCE);
        }
    }

    public function deleteShop(Request $request)
    {
        $id = $request->id;
        if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN) || ($request->user()->hasPermissionTo(Permission::STORE_OWNER) && ($request->user()->shops->contains($id)))) {
            try {
                $shop = $this->repository->findOrFail($id);
            } catch (\Exception $e) {
                throw new ModelNotFoundException(NOT_FOUND);
            }
            $shop->delete();
            return $shop;
        }
        throw new AuthorizationException(NOT_AUTHORIZED);
    }

    public function approveShop(Request $request)
    {

        try {
            if (!$request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                throw new MarvelException(NOT_AUTHORIZED);
            }
            $id = $request->id;
            $admin_commission_rate = $request->admin_commission_rate;
            try {
                $shop = $this->repository->findOrFail($id);
            } catch (\Exception $e) {
                throw new ModelNotFoundException(NOT_FOUND);
            }
            $shop->is_active = true;
            $shop->save();

            if (Product::count() > 0) {
                Product::where('shop_id', '=', $id)->update(['status' => 'publish']);
            }

            $balance = Balance::firstOrNew(['shop_id' => $id]);

            if (!$request->isCustomCommission) {
                $adminCommissionDefaultRate = $this->getCommissionRate($balance->total_earnings);
                $balance->admin_commission_rate = $adminCommissionDefaultRate;
            }else{
                $balance->admin_commission_rate = $admin_commission_rate;
            }
            $balance->is_custom_commission = $request->isCustomCommission;
            $balance->save();
            return $shop;
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    public function disApproveShop(Request $request)
    {
        try {
            if (!$request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                throw new MarvelException(NOT_AUTHORIZED);
            }
            $id = $request->id;
            try {
                $shop = $this->repository->findOrFail($id);
            } catch (\Exception $e) {
                throw new ModelNotFoundException(NOT_FOUND);
            }

            $shop->is_active = false;
            $shop->save();

            Product::where('shop_id', '=', $id)->update(['status' => 'draft']);

            return $shop;
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    public function addStaff(UserCreateRequest $request)
    {
        try {
            if ($this->repository->hasPermission($request->user(), $request->shop_id)) {
                $permissions = [Permission::CUSTOMER, Permission::STAFF];
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'shop_id' => $request->shop_id,
                    'password' => Hash::make($request->password),
                ]);

                $user->givePermissionTo($permissions);
                $user->assignRole(Role::STAFF);

                return true;
            }
            throw new AuthorizationException(NOT_AUTHORIZED);
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    public function deleteStaff(Request $request, $id)
    {
        try {
            $request->id = $id;
            return $this->removeStaff($request);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_DELETE_THE_RESOURCE);
        }
    }

    public function removeStaff(Request $request)
    {
        $id = $request->id;
        try {
            $staff = User::findOrFail($id);
        } catch (\Exception $e) {
            throw new ModelNotFoundException(NOT_FOUND);
        }
        if ($request->user()->hasPermissionTo(Permission::STORE_OWNER) || ($request->user()->hasPermissionTo(Permission::STORE_OWNER) && ($request->user()->shops->contains('id', $staff->shop_id)))) {
            $staff->delete();
            return $staff;
        }
        throw new AuthorizationException(NOT_AUTHORIZED);
    }

    public function myShops(Request $request)
    {
        $user = $request->user();
        return $this->repository->where('owner_id', '=', $user->id)->get();
    }


    /**
     * Popular products by followed shops
     *
     * @param Request $request
     * @return array
     * @throws MarvelException
     */
    public function followedShopsPopularProducts(Request $request)
    {
        $request->validate([
            'limit' => 'numeric',
        ]);

        try {
            $user = $request->user();
            $userShops = User::where('id', $user->id)->with('follow_shops')->get();
            $followedShopIds = $userShops->first()->follow_shops->pluck('id')->all();
            $limit = $request->limit ? $request->limit : 10;

            $products_query = Product::withCount('orders')->with(['shop'])->whereIn('shop_id', $followedShopIds)->orderBy('orders_count', 'desc');

            return $products_query->take($limit)->get();
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Get all the followed shops of logged-in user
     *
     * @param Request $request
     * @return mixed
     */
    public function userFollowedShops(Request $request)
    {
        $limit = $request->limit ? $request->limit : 15;
        $user = $request->user();
        $currentUser = User::where('id', $user->id)->first();

        return $currentUser->follow_shops()->paginate($limit);
    }

    /**
     * Get boolean response of a shop follow/unfollow status
     *
     * @param Request $request
     * @return bool
     * @throws MarvelException
     */
    public function userFollowedShop(Request $request)
    {
        $request->validate([
            'shop_id' => 'required|numeric',
        ]);

        try {
            $user = $request->user();
            $userShops = User::where('id', $user->id)->with('follow_shops')->get();
            $followedShopIds = $userShops->first()->follow_shops->pluck('id')->all();

            $shop_id = (int)$request->input('shop_id');

            return in_array($shop_id, $followedShopIds);
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Follow/Unfollow shop
     *
     * @param Request $request
     * @return bool
     * @throws MarvelException
     */
    public function handleFollowShop(Request $request)
    {
        $request->validate([
            'shop_id' => 'required|numeric',
        ]);

        try {
            $user = $request->user();
            $userShops = User::where('id', $user->id)->with('follow_shops')->get();
            $followedShopIds = $userShops->first()->follow_shops->pluck('id')->all();

            $shop_id = (int)$request->input('shop_id');

            if (in_array($shop_id, $followedShopIds)) {
                $followedShopIds = array_diff($followedShopIds, [$shop_id]);
            } else {
                $followedShopIds[] = $shop_id;
            }

            $response = $user->follow_shops()->sync($followedShopIds);

            if (count($response['attached'])) {
                return true;
            }

            if (count($response['detached'])) {
                return false;
            }
        } catch (MarvelException $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    public function nearByShop($lat, $lng, Request $request)
    {
        $request['lat'] = $lat;
        $request['lng'] = $lng;

        return $this->findShopDistance($request);
    }

    public function findShopDistance(Request $request)
    {
        try {
            $settings = Settings::getData();
            $maxShopDistance = isset($settings['options']['maxShopDistance']) ? $settings['options']['maxShopDistance'] : 1000;
            $lat = $request->lat;
            $lng = $request->lng;
            if (!is_numeric($lat) || !is_numeric($lng)) {
                throw new HttpException(400, 'invalid argument');
            }

            $near_shop = Shop::where('settings->location->lat', '!=', null)
                ->where('settings->location->lng', '!=', null)
                ->select(
                    "shops.*",
                    DB::raw("6371 * acos(cos(radians(" . $lat . ")) 
        * cos(radians(json_unquote(json_extract(`shops`.`settings`, '$.\"location\".\"lat\"')))) 
        * cos(radians(json_unquote(json_extract(`shops`.`settings`, '$.\"location\".\"lng\"'))) - radians(" . $lng . ")) 
        + sin(radians(" . $lat . ")) 
        * sin(radians(json_unquote(json_extract(`shops`.`settings`, '$.\"location\".\"lat\"'))))) AS distance")
                )
                ->orderBy('distance', 'ASC')
                ->where('is_active', 1)
                ->get()
                ->where('distance', '<', $maxShopDistance);

            return $near_shop;
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    /**
     * newOrInActiveShops
     *
     * @param  Request $request
     * @return Collection|Shop[]
     */
    public function newOrInActiveShops(Request $request)
    {
        try {
            $limit = $request->limit ? $request->limit : 15;
            return $this->repository->withCount(['orders', 'products'])->with(['owner.profile'])->where('is_active', '=', $request->is_active)->paginate($limit)->withQueryString();
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }

    /**
     * transferShopOwnership
     *
     */
    public function transferShopOwnership(TransferShopOwnerShipRequest $request)
    {
        try {
            return DB::transaction(fn () => $this->repository->transferShopOwnership($request));
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }
}
