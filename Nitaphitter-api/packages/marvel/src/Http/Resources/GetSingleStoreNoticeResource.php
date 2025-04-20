<?php


namespace Marvel\Http\Resources;


use Illuminate\Http\Request;
use Marvel\Helper\ResourceHelpers;


class GetSingleStoreNoticeResource extends Resource
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
            'id' => $this->id,
            'type' => $this->type,
            'priority' => $this->priority,
            'notice' => $this->notice,
            'description' => $this->description,
            'effective_from' => $this->effective_from,
            'expired_at' => $this->expired_at,
            'creator_role' => $this->creator_role,
            'users' => $this->users,
            'shops' => $this->shops,


        ];
    }
}
