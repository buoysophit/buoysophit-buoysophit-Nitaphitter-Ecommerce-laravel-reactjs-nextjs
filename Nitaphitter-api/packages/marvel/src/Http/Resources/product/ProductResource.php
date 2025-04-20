<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class ProductResource extends Resource
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
            'name'                 => $this->name,
            'slug'                 => $this->slug,
            'type'                 => getResourceData($this->type, ['settings']), // if you need extra data then pass key in array by second parameter
            'language'             => $this->language,
            'translated_languages' => $this->translated_languages,
            'product_type'         => $this->product_type,
            'shop'                 => getResourceData($this->shop, []), // if you need extra data then pass key in array by second parameter
            'sale_price'           => $this->sale_price,
            'max_price'            => $this->max_price,
            'min_price'            => $this->min_price,
            'image'                => $this->image,
            'status'               => $this->status,
            'price'                => $this->price,
            'quantity'             => $this->quantity,
            'unit'                 => $this->unit,
            'sku'                  => $this->sku,
            'sold_quantity'        => $this->sold_quantity,
            'in_flash_sale'        => $this->in_flash_sale,
            'visibility'           => $this->visibility
        ];
    }
}
