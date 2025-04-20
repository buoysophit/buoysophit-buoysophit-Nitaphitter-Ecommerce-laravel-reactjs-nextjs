@component('mail::message')

@if($receiver == 'admin')
# {{ __('sms.order.refundStatusChange.admin.subject') }}

{{ __('sms.order.refundStatusChange.admin.message',['ORDER_TRACKING_NUMBER' => $order->tracking_number, 'refund_status' => $status]) }}

@component('mail::button', ['url' => $url ])
    {{__('common.view-order')}}
@endcomponent
@else
# {{ __('sms.order.refundStatusChange.customer.subject') }}

{{ __('sms.order.refundStatusChange.customer.message',['ORDER_TRACKING_NUMBER' => $order->tracking_number, 'refund_status' => $status]) }}

@component('mail::button', ['url' => $url ])
    {{__('common.view-order')}}
@endcomponent
@endif



{{__('common.thanks')}},<br>
{{ config('app.name') }}
@endcomponent
