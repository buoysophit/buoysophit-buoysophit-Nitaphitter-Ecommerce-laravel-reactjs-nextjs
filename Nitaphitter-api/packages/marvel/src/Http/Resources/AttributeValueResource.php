<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class AttributeValueResource extends Resource
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
            'value'                => $this->value,
            'attribute_id'         => $this->attribute_id,
            'slug'                 => $this->slug,
            'meta'                 => $this->meta,
            'language'             => $this->language,
            'translated_languages' => $this->translated_languages,
 ];
    }
}
