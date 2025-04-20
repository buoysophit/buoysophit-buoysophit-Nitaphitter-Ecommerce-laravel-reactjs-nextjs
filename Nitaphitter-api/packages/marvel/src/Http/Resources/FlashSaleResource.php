<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;
use Marvel\Helper\ResourceHelpers;

class FlashSaleResource extends Resource
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
            "id" => $this->id,
            "title" => $this->title,
            "slug" => $this->slug,
            "description" => $this->description,
            "start_date" => $this->start_date,
            "end_date" => $this->end_date,
            "sale_status" => $this->sale_status,
            "type" => $this->type,
            "rate" => $this->rate,
            "sale_builder" => $this->sale_builder,
            "image" => $this->image,
            "cover_image" => $this->cover_image,
            "products" => ProductResource::collection($this->products),
            "language" => $this->language,
            "deleted_at" => $this->deleted_at,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
