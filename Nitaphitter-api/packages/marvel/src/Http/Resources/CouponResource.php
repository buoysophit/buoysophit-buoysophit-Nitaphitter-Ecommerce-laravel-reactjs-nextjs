<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class CouponResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'                   => $this->id,
            'code'                 => $this->code,
            'language'             => $this->language,
            'description'          => $this->description,
            'image'                => $this->image,
            'type'                 => $this->type,
            'amount'               => $this->amount,
            'minimum_cart_amount'  => $this->minimum_cart_amount,
            'active_from'          => $this->active_from,
            'expire_at'            => $this->expire_at,
            'is_valid'            => $this->is_valid,
            'target'               => $this->target,
            'is_approve'           => $this->is_approve,
            'translated_languages' => $this->translated_languages,
            'shop_id'              => $this->shop_id,
            'user_id'              => $this->user_id,
        ];
    }
}