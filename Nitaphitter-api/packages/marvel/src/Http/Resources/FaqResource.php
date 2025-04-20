<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;
use Marvel\Helper\ResourceHelpers;

class FaqResource extends Resource
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
            'id'              => $this->id,
            'faq_title'       => $this->faq_title,
            'slug'            => $this->slug,
            'faq_description' => $this->faq_description,
            'faq_type'        => $this->faq_type,
            'issued_by'       => $this->issued_by,
            'language'        => $this->language,
            'translated_languages' => $this->translated_languages,
        ];
    }
}
