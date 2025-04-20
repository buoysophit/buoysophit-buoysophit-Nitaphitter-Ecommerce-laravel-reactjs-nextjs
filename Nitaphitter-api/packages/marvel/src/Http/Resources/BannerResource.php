<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class BannerResource extends Resource
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
            'id'          => $this->id,
            'title'       => $this->title,
            'type_id'     => $this->type_id,
            'description' => $this->description,
            'image'       => $this->image
        ];
    }
}