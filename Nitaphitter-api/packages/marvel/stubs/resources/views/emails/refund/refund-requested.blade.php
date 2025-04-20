@component('mail::message')

@if($receiver == 'admin')
# {{ __('sms.order.refundRequested.admin.subject') }}

{{ __('sms.order.refundRequested.admin.message',['ORDER_TRACKING_NUMBER'=>$order->tracking_number]) }}

@component('mail::button', ['url' => $url ])
{{__('common.view-order')}}
@endcomponent
@else
# {{ __('sms.order.refundRequested.customer.subject') }}

{{ __('sms.order.refundRequested.customer.message',['ORDER_TRACKING_NUMBER'=>$order->tracking_number]) }}

@component('mail::button', ['url' => $url ])
{{__('common.view-order')}}
@endcomponent
@endif



{{__('common.thanks')}},<br>
{{ config('app.name') }}
@endcomponent
