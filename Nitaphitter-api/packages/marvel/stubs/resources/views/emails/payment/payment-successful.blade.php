{{--$order collection is available here--}}

@component('mail::message')
# {{ __('sms.order.paymentSuccessOrder.admin.subject') }}

{{ __('sms.order.paymentSuccessOrder.admin.message',['ORDER_TRACKING_NUMBER'=>$order->tracking_number]) }}

@component('mail::button', ['url' => $url ])
{{__('common.view-order')}}
@endcomponent

{{__('common.thanks')}},<br>
{{ config('app.name') }}
@endcomponent
