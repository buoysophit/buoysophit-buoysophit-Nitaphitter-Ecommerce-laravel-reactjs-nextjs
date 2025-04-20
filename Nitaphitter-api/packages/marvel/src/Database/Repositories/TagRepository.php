<?php


namespace Marvel\Database\Repositories;


use Marvel\Database\Models\Tag;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;



class TagRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'type.slug',
        'language'
    ];

    protected $dataArray = [
        'name',
        'slug',
        'type_id',
        'icon',
        'image',
        'details',
        'language',
    ];

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
            //
        }
    }


    /**
     * Configure the Model
     **/
    public function model()
    {
        return Tag::class;
    }

    public function updateTag($request, $tag)
    {
        $data = $request->only($this->dataArray);
        if (!empty($request->slug) &&  $request->slug != $tag['slug']) {
            $data['slug'] = $this->makeSlug($request);
        }
        $tag->update($data);
        return $this->findOrFail($tag->id);
    }
}
