<?php


namespace Marvel\Database\Repositories;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\Shop;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;
use Prettus\Repository\Eloquent\BaseRepository as Repository;

abstract class BaseRepository extends Repository implements CacheableInterface
{
    use CacheableRepository;

    /**
     * Find data by field and value
     *
     * @param string $field
     * @param string $value
     * @param array $columns
     * @return mixed
     */
    public function findOneByField($field, $value = null, $columns = ['*'])
    {
        $model = $this->findByField($field, $value, $columns = ['*']);

        return $model->first();
    }

    
    /**
     * The function finds a model by a specific field and value, and throws an exception if it is not
     * found.
     * 
     * @param string field The "field" parameter is used to specify the column name in the database table that
     * you want to search for. It is typically a string value representing the name of the column.
     * @param mixed value The "value" parameter is the value that you want to search for in the specified
     * field. It is used to find a specific record in the database table based on the given field and
     * value.
     * @param array columns The "columns" parameter is an optional parameter that specifies which columns
     * from the database table should be retrieved. By default, it is set to ['*'], which means all
     * columns will be retrieved. However, you can pass an array of specific column names to retrieve
     * only those columns.
     * 
     * @return \Illuminate\Database\Eloquent\Model first model that matches the given field and value.
     */
    public function findOneByFieldOrFail($field, $value = null, $columns = ['*'])
    {
        $model = $this->findByField($field, $value, $columns = ['*']);
        if (!$model->first()) {
            throw new MarvelException(NOT_FOUND);
        }
        return $model->first();
    }


    /**
     * Find data by field and value
     *
     * @param string $field
     * @param string $value
     * @param array $columns
     * @return mixed
     */
    public function findOneWhere(array $where, $columns = ['*'])
    {
        $model = $this->findWhere($where, $columns);

        return $model->first();
    }

    /**
     * Find data by id
     *
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function find($id, $columns = ['*'])
    {
        $this->applyCriteria();
        $this->applyScope();
        $model = $this->model->find($id, $columns);
        $this->resetModel();

        return $this->parserResult($model);
    }

    /**
     * Find data by id
     *
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function findOrFail($id, $columns = ['*'])
    {
        $this->applyCriteria();
        $this->applyScope();
        $model = $this->model->findOrFail($id, $columns);
        $this->resetModel();

        return $this->parserResult($model);
    }

    /**
     * Count results of repository
     *
     * @param array $where
     * @param string $columns
     * @return int
     */
    public function count(array $where = [], $columns = '*')
    {
        $this->applyCriteria();
        $this->applyScope();

        if ($where) {
            $this->applyConditions($where);
        }

        $result = $this->model->count($columns);
        $this->resetModel();
        $this->resetScope();

        return $result;
    }

    /**
     * @param string $columns
     * @return mixed
     */
    public function sum($columns)
    {
        $this->applyCriteria();
        $this->applyScope();

        $sum = $this->model->sum($columns);
        $this->resetModel();

        return $sum;
    }

    /**
     * @param string $columns
     * @return mixed
     */
    public function avg($columns)
    {
        $this->applyCriteria();
        $this->applyScope();

        $avg = $this->model->avg($columns);
        $this->resetModel();

        return $avg;
    }

    /**
     * @return mixed
     */
    public function getModel()
    {
        return $this->model;
    }

    public function hasPermission($user, $shop_id = null)
    {
        if ($user && $user->hasPermissionTo(Permission::SUPER_ADMIN)) {
            return true;
        }
        try {
            $shop = Shop::findOrFail($shop_id);
        } catch (Exception $e) {
            return false;
        }
        if (!$shop->is_active) {
            throw new MarvelException(SHOP_NOT_APPROVED);
        }
        if ($user &&  $user->hasPermissionTo(Permission::STORE_OWNER)) {
            if ($shop->owner_id === $user->id) {
                return true;
            }
        } elseif ($user &&  $user->hasPermissionTo(Permission::STAFF)) {
            if ($shop->staffs->contains($user)) {
                return true;
            }
        }
        return false;
    }

    function csvToArray($filename = '', $delimiter = ',')
    {
        if (!file_exists($filename) || !is_readable($filename)) {
            return false;
        }
        $header = null;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== false) {
            while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                if (!$header) {
                    $exclude = ['id', 'slug', 'deleted_at', 'created_at', 'updated_at', 'shipping_class_id'];
                    $row = array_diff($row, $exclude);
                    $header = $row;
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }

        return $data;
    }


    /**
     * It takes a request object, and a key, and returns a slug.
     * 
     * @param Request request The request object
     * @param string key The key of the request that you want to slugify.
     * 
     * @return string A string
     */
    public function makeSlug(Request $request, string $key = '', ?int $update = null): string
    {
        $slugText = match (true) {
            !empty($request->slug)  => $request->slug,
            !empty($request->name)  => $request->name,
            !empty($request->title) => $request->title,
            !empty($request[$key])  => $request[$key],
            empty($request->slug)   => 'auto-generated-string',
        };
        if (empty($key)) {
            return globalSlugify(slugText: $slugText, model: $this->model(), update: $update);
        }
        return globalSlugify(slugText: $request[$key], model: $this->model(), key: $key, update: $update);
    }

    public function findBySlugOrId(int | string $value, string $language = DEFAULT_LANGUAGE)
    {
        return match (true) {
            is_numeric($value) => $this->where('id', $value)->where('language', $language)->firstOrFail(),
            is_string($value)  => $this->where('slug', $value)->where('language', $language)->firstOrFail(),
        };
    }
}
