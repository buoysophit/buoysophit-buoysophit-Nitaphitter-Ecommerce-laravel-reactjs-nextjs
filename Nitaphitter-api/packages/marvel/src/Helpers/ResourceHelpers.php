<?php



function getResourceData($data, array $extra = [])
{
    $item = [
        'id'   => $data?->id,
        'name' => $data?->name,
        'slug' => $data?->slug,
        'logo' => $data?->logo
    ];

    if (!empty($extra)) {
        foreach ($extra as $key) {
            if (isset($key)) {
                $item[$key] = $data?->$key;
            }
        }
    }
    return $item;
}

function getResourceCollection($data, array $extra = [])
{
    return collect($data)->map(function ($item) use ($extra) {
        $item = [
            'id'   => $item['id'],
            'name' => $item['name'],
            'slug' => $item['slug'],
        ];

        if (!empty($extra)) {
            foreach ($extra as $key) {
                if (isset($item[$key])) {
                    $item[$key] = $item[$key];
                }
            }
        }
        return $item;
    })->toArray();
}

function getVariations($data)
{
    $variations = [];
    foreach ($data as $item) {
        $variations[] = [
            'id'           => $item['id'],
            'slug'         => $item['slug'],
            'attribute_id' => $item['attribute_id'],
            'value'        => $item['value'],
            'language'     => $item['language'],
            'meta'         => $item['meta'],
            'translated_languages' => $item['translated_languages'],
            'attribute' => $item['attribute'],
        ];
    }
    return $variations;
}
