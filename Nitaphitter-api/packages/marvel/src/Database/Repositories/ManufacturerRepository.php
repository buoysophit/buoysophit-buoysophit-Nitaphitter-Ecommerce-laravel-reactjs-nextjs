<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\Manufacturer;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Marvel\Enums\Permission;


class ManufacturerRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'is_approved',
        'type.slug',
        'language',

    ];

    protected $dataArray = [
        'name',
        'slug',
        'image',
        'type_id',
        'is_approved',
        'cover_image',
        'description',
        'socials',
        'website',
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
        return Manufacturer::class;
    }

    public function storeManufacturer($request)
    {
        $data = $request->only($this->dataArray);
        $data['slug'] = $this->makeSlug($request);
        if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
            $data['is_approved'] = true;
        } else {
            $data['is_approved'] = false;
        }
        return $this->create($data);
    }

    public function updateManufacturer($request, $Manufacturer)
    {
        $data = $request->only($this->dataArray);
        if (!empty($request->slug) &&  $request->slug != $Manufacturer['slug']) {
            $data['slug'] = $this->makeSlug($request);
        }
        $Manufacturer->update($data);
        return $this->findOrFail($Manufacturer->id);
    }
}
