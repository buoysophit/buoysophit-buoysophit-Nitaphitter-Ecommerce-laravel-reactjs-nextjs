<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;
use Marvel\Helper\ResourceHelpers;

class TermsConditionResource extends Resource
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
            'title'                => $this->title,
            'slug'                 => $this->slug,
            'description'          => $this->description,
            'type'                 => $this->type,
            'issued_by'            => $this->issued_by,
            'is_approved'          => $this->is_approved,
            'language'             => $this->language,
            'translated_languages' => $this->translated_languages,
            'is_approved'          => $this->is_approved,
        ];
    }
}
