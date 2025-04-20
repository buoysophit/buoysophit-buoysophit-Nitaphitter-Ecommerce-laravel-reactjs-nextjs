<?php

namespace Marvel\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Marvel\Database\Models\Address;
use Marvel\Database\Repositories\SettingsRepository;
use Marvel\Events\Maintenance;
use Marvel\Exceptions\MarvelException;
use Illuminate\Support\Facades\Cache;
use Marvel\Http\Requests\SettingsRequest;
use Prettus\Validator\Exceptions\ValidatorException;

class SettingsController extends CoreController
{
    public $repository;

    public function __construct(SettingsRepository $repository)
    {
        $this->repository = $repository;
    }


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Address[]
     */
    public function index(Request $request)
    {
        $language = $request->language ? $request->language : DEFAULT_LANGUAGE;

        $data = Cache::rememberForever(
            'cached_settings_' . $language,
            function () use ($request) {
                return $this->repository->getData($request->language);
            }
        );

        // Format maintenance start and until data
        $maintenanceStart = Carbon::parse($data['options']['maintenance']['start'])->format('F j, Y h:i A');
        $maintenanceUntil = Carbon::parse($data['options']['maintenance']['until'])->format('F j, Y h:i A');

        $formattedMaintenance = [
            "start" => $maintenanceStart,
            "until" => $maintenanceUntil,
        ];

        // Add formatted maintenance data to the existing data
        $data['maintenance'] = $formattedMaintenance;

        return $data;
    }

    // public function fetchSettings(Request $request)
    // {
    //     $language = $request->language ? $request->language : DEFAULT_LANGUAGE;
    //     return $this->repository->getData($language);
    // }

    /**
     * Store a newly created resource in storage.
     *
     * @param SettingsRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(SettingsRequest $request)
    {
        $language = $request->language ? $request->language : DEFAULT_LANGUAGE;
        $request->merge([
            'options' => [
                ...$request->options,
                ...$this->repository->getApplicationSettings(),
                'server_info' => server_environment_info(),
            ]
        ]);

        $data = $this->repository->where('language', $request->language)->first();

        if ($data) {
            if (Cache::has('cached_settings_' . $language)) {
                Cache::forget('cached_settings_' . $language);
            }
            $settings =  tap($data)->update($request->only(['options']));
        } else {
            // Cache::flush();
            $settings =  $this->repository->create(['options' => $request['options'], 'language' => $language]);
        }
        event(new Maintenance($language));
        return $settings;
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            return $this->repository->first();
        } catch (\Exception $e) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param SettingsRequest $request
     * @param int $id
     * @return JsonResponse
     * @throws ValidatorException
     */
    public function update(SettingsRequest $request, $id)
    {
        $settings = $this->repository->first();
        if (isset($settings->id)) {
            return $this->repository->update($request->only(['options']), $settings->id);
        } else {
            return $this->repository->create(['options' => $request['options']]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return array
     */
    public function destroy($id)
    {
        throw new MarvelException(ACTION_NOT_VALID);
    }
}
