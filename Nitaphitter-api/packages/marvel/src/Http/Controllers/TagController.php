<?php


namespace Marvel\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\Tag;
use Marvel\Database\Repositories\TagRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\TagCreateRequest;
use Marvel\Http\Requests\TagUpdateRequest;
use Marvel\Http\Resources\TagResource;
use Prettus\Validator\Exceptions\ValidatorException;


class TagController extends CoreController
{
    public $repository;

    public function __construct(TagRepository $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Tag[]
     */
    public function index(Request $request)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        $limit = $request->limit ?   $request->limit : 15;
        $tags = $this->repository->where('language', $language)->with(['type'])->paginate($limit);
        $data = TagResource::collection($tags)->response()->getData(true);
        return formatAPIResourcePaginate($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TagCreateRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(TagCreateRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $validatedData['slug'] = $this->repository->makeSlug($request);
            return $this->repository->create($validatedData);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, $params)
    {

        try {
            $language = $request->language ?? DEFAULT_LANGUAGE;
            if (is_numeric($params)) {
                $params = (int) $params;
                $tag = $this->repository->where('id', $params)->with(['type'])->firstOrFail();
                return new TagResource($tag);
            }
            $tag = $this->repository->where('slug', $params)->where('language', $language)->with(['type'])->firstOrFail();
            return new TagResource($tag);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TagUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(TagUpdateRequest $request, $id)
    {
        try {
            $request['id'] = $id;
            return $this->tagUpdate($request);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }

    public function tagUpdate(Request $request)
    {
        try {
            $tag = $this->repository->findOrFail($request->id);
            return $this->repository->updateTag($request, $tag);
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        try {
            return $this->repository->findOrFail($id)->delete();
        } catch (MarvelException $th) {
            throw new MarvelException(COULD_NOT_CREATE_THE_RESOURCE);
        }
    }
}
