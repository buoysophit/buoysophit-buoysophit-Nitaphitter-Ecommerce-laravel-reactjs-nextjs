<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class AuthorResource extends Resource
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
            'is_approved'          => $this->is_approved,
            'translated_languages' => $this->translated_languages,
            'slug'                 => $this->slug,
            'bio'                  => $this->bio,
            'quote'                => $this->quote,
            'products_count'       => $this->products_count,
            'born'                 => $this->born,
            'death'                => $this->death,
            'languages'            => $this->languages,
            'socials'              => $this->socials,
            'image'                => $this->image,
            'cover_image'          => $this->cover_image,
        ];
    }
}
