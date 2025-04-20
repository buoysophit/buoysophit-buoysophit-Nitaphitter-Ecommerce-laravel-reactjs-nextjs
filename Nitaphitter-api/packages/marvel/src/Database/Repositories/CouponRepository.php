<?php


namespace Marvel\Database\Repositories;

use Exception;
use Illuminate\Http\Request;
use Marvel\Database\Models\Coupon;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\Shop;
use Marvel\Enums\CouponType;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelBadRequestException;

class CouponRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'code'        => 'like',
        'shop_id',
        'language',

    ];

    protected $dataArray = [
        'code',
        'language',
        'description',
        'image',
        'type',
        'amount',
        'minimum_cart_amount',
        'active_from',
        'expire_at',
        'target',
        'is_approve',
        'user_id',
        'shop_id',
    ];

    public function getDataArray(): array
    {
        return $this->dataArray;
    }

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
        return Coupon::class;
    }

    /**
     * storeCoupon
     *
     * @param  mixed $request
     * @return mixed
     */
    public function storeCoupon(Request $request)
    {
        try {
            $data = $request->only($this->dataArray);
            $data['user_id'] = $request->user()->id;
            $data['is_approve'] = $request->user()->hasPermissionTo(Permission::SUPER_ADMIN);
            return $this->create($data);
        } catch (Exception $th) {
            throw new MarvelBadRequestException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }
    public function verifyCoupon(Request $request)
    {
        $code = $request->code;
        $sub_total = $request->sub_total;
        $item = $request->item ?? null;
        try {
            $coupon = $this->findOneByFieldOrFail('code', $code);
            $settings = Settings::getData();
            $is_satisfy = $sub_total >= $coupon->minimum_cart_amount;
            $is_freeShipping = $settings['options']['freeShipping'];
            $freeShippingAmount = $settings['options']['freeShippingAmount'];
            $couponShopId = $coupon->shop_id;
            $useFreeShipping = $is_freeShipping && $freeShippingAmount <= $sub_total;

            if (!$coupon->is_approve || (empty($request->user()) && $coupon->target)) {
                return ["is_valid" => false, "message" => $coupon->is_approve ? THIS_COUPON_CODE_IS_ONLY_FOR_VERIFIED_USERS : THIS_COUPON_CODE_IS_NOT_APPROVED];
            }

            $onlyThisShopProductApplyCoupon = true;
            if ($couponShopId && $item) {
                $totalCartAmount = array_reduce(
                    $item,
                    fn ($sum, $product) => $sum + (isset($product['shop_id']) && $product['shop_id'] == $couponShopId ? $product['price'] * $product['quantity'] : 0),
                    0
                );

                $isLessThanSubtotal = $sub_total >= $totalCartAmount;

                switch ($coupon->type) {
                    case CouponType::FIXED_COUPON:
                        $onlyThisShopProductApplyCoupon = $isLessThanSubtotal && $totalCartAmount > $coupon->amount;
                        break;
                    case CouponType::PERCENTAGE_COUPON:
                        $couponPercentageAmount = ($totalCartAmount * $coupon->amount) / 100;
                        $onlyThisShopProductApplyCoupon = $isLessThanSubtotal && $totalCartAmount > $couponPercentageAmount;
                        break;
                    case CouponType::FREE_SHIPPING_COUPON:
                        $onlyThisShopProductApplyCoupon = $isLessThanSubtotal && $useFreeShipping;
                        break;
                }
            }

            if (!$onlyThisShopProductApplyCoupon) {
                return ["is_valid" => false, "message" => COUPON_CODE_IS_NOT_APPLICABLE_IN_THIS_SHOP_PRODUCT];
            }

            if (
                $coupon->is_valid &&
                $useFreeShipping &&
                $coupon->type == CouponType::FREE_SHIPPING_COUPON
            ) {
                return ["is_valid" => false, "message" => ALREADY_FREE_SHIPPING_ACTIVATED];
            } elseif ($coupon->is_valid && $is_satisfy && $onlyThisShopProductApplyCoupon) {
                return ["is_valid" => true, "coupon" => $coupon];
            } elseif ($coupon->is_valid && !$is_satisfy) {
                return ["is_valid" => false, "message" => COUPON_CODE_IS_NOT_APPLICABLE];
            } else {
                return ["is_valid" => false, "message" => INVALID_COUPON_CODE];
            }
        } catch (\Exception $th) {
            return ["is_valid" => false, "message" => INVALID_COUPON_CODE];
        }
    }
}
