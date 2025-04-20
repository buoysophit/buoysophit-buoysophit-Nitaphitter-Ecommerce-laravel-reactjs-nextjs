<?php


namespace Marvel\Database\Repositories;

use Illuminate\Http\Request;
use Marvel\Database\Models\Category;
use Marvel\Http\Requests\CategoryCreateRequest;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;



class CategoryRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'parent',
        'language',
//        'type.slug',
    ];

    protected $dataArray = [
        'name',
        'slug',
        'type_id',
        'icon',
        'image',
        'details',
        'banner_image',
        'language',
        'parent',
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
        return Category::class;
    }

    public function saveCategory(Request $request) {
        $data = $request->only($this->dataArray);
        $data['slug'] = $this->makeSlug($request);
        return $this->create($data);
    }
    
    public function updateCategory($request, $category)
    {
        $data = $request->only($this->dataArray);
        if (!empty($request->slug) &&  $request->slug != $category['slug']) {
            $data['slug'] = $this->makeSlug($request);
        }
        $category->update($data);
        return $this->findOrFail($category->id);
    }
}
