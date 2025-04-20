<?php


namespace Marvel\Http\Controllers;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Marvel\Database\Repositories\NotifyLogsRepository;
use Marvel\Database\Repositories\UserRepository;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;

class NotifyLogsController extends CoreController
{
    public $repository;

    public $userRepository;

    public function __construct(NotifyLogsRepository $repository, UserRepository $userRepository)
    {
        $this->repository = $repository;
        $this->userRepository = $userRepository;
    }

    /**
     * index
     *
     * @param  Request $request
     * @return Collection|NotifyLogs[]
     */
    public function index(Request $request)
    {
        try {
            $limit = $request->limit ? $request->limit : 10;
            return $this->fetchNotifyLogs($request)->paginate($limit)->withQueryString();
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }

    /**
     * fetchNotifyLogs
     *
     * @param  Request $request
     * @return object
     */
    public function fetchNotifyLogs(Request $request)
    {
        $user = $request->user();
        $notify_log_query = $this->repository->with(['sender_user'])->where('receiver', '=', $user->id);

        if (isset($request->notify_type) && !empty($request->notify_type)) {
            $notify_log_query = $notify_log_query->where('notify_type', "=", $request->notify_type);
        }

        return $notify_log_query;
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return object
     */
    public function show(Request $request, $id)
    {
        try {
            $request['id'] = $id;
            return $this->fetchNotifyLog($request);
        } catch (MarvelException $th) {
            throw new MarvelException(NOT_FOUND);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param $slug
     * @return object
     */
    public function fetchNotifyLog(Request $request)
    {
        try {
            $id = $request['id'];
            return $this->repository->where('id', '=', $id)->firstOrFail();
        } catch (Exception $th) {
            throw new HttpException(404, NOT_FOUND);
        }
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id, Request $request)
    {
        try {
            $request['id'] = $id;
            return $this->deleteNotifyLogs($request);
        } catch (MarvelException $th) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }

    public function deleteNotifyLogs(Request $request)
    {
        try {
            if ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return $this->repository->findOrFail($request->id)->delete();
            }
        } catch (MarvelException $th) {
            throw new MarvelException(NOT_AUTHORIZED, $th->getMessage());
        }
    }

    /**
     * readNotifyLogs
     *
     * @param  Request $request
     * @return void
     */
    public function readNotifyLogs(Request $request)
    {
        try {
            $notify_log = $this->repository->findOrFail($request->id);
            $notify_log->is_read = true;
            $notify_log->save();
            return $notify_log;
        } catch (MarvelException $th) {
            throw new MarvelException(NOT_AUTHORIZED, $th->getMessage());
        }
    }


    /**
     * readAllNotifyLogs
     *
     * @param  Request $request
     * @return void
     */
    public function readAllNotifyLogs(Request $request)
    {
        try {
            if (isset($request->set_all_read)) {
                $notify_logs = $this->repository->where("notify_type", "=", $request->notify_type)->where('receiver', '=', $request->receiver)->get();

                foreach ($notify_logs as $key => $notify_log) {
                    $notify_log->is_read = true;
                    $notify_log->save();
                }

                return $notify_logs;
            }
        } catch (MarvelException $th) {
            throw new MarvelException(NOT_AUTHORIZED, $th->getMessage());
        }
    }
}
