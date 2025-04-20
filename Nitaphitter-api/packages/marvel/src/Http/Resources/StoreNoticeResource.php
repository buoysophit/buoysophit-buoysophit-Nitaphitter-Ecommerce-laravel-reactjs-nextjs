<?php


namespace Marvel\Http\Resources;


use Illuminate\Http\Request;


class StoreNoticeResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'             => $this->id,
            'type'           => $this->type,
            'priority'       => $this->priority,
            'notice'         => $this->notice,
            'description'    => $this->description,
            'effective_from' => $this->effective_from,
            'expired_at'     => $this->expired_at,
            'creator_role'   => $this->creator_role,
            'is_read'        => $this->is_read,
            'creator'        => ['id' => $this->creator->id, 'name' => $this->creator->name, 'email' => $this->creator->email],
            'users'          => getResourceCollection($this->users, ['email']),
            'shops'          => getResourceCollection($this->shops),
            'read_status'    => $this->readStatusRecourseData($this->read_status),
        ];
    }


    private function readStatusRecourseData($read_status): array
    {
        return collect($read_status)->map(function ($value) {
            return [
                'id' => $value->id,
                'name' => $value->name,
                'email' => $value->email,
                'is_read' => $value->pivot->is_read,
                'pivot' => $value->pivot,
            ];
        })->toArray();
    }
}
