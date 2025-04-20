<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;
use Marvel\Helper\ResourceHelpers;

class TagResource extends Resource
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
            'language'             => $this->language,
            'translated_languages' => $this->translated_languages,
            'slug'                 => $this->slug,
            'details'              => $this->details,
            'image'                => $this->image,
            'icon'                 => $this->icon,
            'type'                 => getResourceData($this->type, []) // if you need extra data then pass key in array by second parameter
        ];
    }
}
