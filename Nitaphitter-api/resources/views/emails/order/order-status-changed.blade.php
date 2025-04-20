{{--$order collection is available here--}}

@component('mail::message')
# {{ __('sms.order.statusChangeOrder.customer.subject') }}
@php

$status = ucfirst(str_replace('-', ' ', $order->order_status));
$status = " **".$status."** ";
@endphp

{{ __('sms.order.statusChangeOrder.customer.message',['ORDER_TRACKING_NUMBER'=>$order->tracking_number,'order_status'=>$status]) }}


@component('mail::button', ['url' => $url ])
{{__('common.view-order')}}
@endcomponent

{{__('common.thanks')}},<br>
{{ config('app.name') }}
@endcomponent
