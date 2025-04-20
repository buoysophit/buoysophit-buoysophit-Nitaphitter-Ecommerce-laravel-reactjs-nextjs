<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class RefundResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {

        return [
            'id'                  => $this->id,
            'refund_reason'       => ['name'=>$this->refund_reason->name ?? null],
            'amount'              => $this->amount,
            'status'              => $this->status,
            'customer'            => ['email' => $this->customer->email ?? null],
            'order'               => $this->getOrderData($this->order),
            'created_at'          => $this->created_at,
        ];
    }

    private function getOrderData($data)
    {
        return [
            'id' => $data->id,
            'tracking_number' => $data->tracking_number,
            'created_at'       => $this->created_at,
        ];
    }
}
