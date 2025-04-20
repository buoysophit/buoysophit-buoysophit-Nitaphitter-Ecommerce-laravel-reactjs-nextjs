<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class TypeResource extends Resource
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
            'id' => $this->id,
            'name' => $this->name,
            'language' => $this->language,
            'translated_languages' => $this->translated_languages,
            'slug' => $this->slug,
            'banners' => BannerResource::collection($this->banners),
            'promotional_sliders' => $this->promotional_sliders,
            'settings' => $this->settings,
            'icon' => $this->icon,
            'images' => $this->images,
        ];
    }
}