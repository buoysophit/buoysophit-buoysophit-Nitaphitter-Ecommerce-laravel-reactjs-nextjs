<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class ManufacturerResource extends Resource
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
            'language'             => $this->language,
            'translated_languages' => $this->translated_languages,
            'products_count'       => $this->products_count,
            'is_approved'          => $this->is_approved,
            'description'          => $this->description,
            'website'              => $this->website,
            'socials'              => $this->socials,
            'image'                => $this->image,
            'cover_image'          => $this->cover_image,
            'type'                 => getResourceData($this->type,[]) // if you need extra data then pass key in array by second parameter
       ];
    }
}
