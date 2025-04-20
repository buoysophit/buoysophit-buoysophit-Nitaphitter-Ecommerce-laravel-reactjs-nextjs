@component('mail::message')
# Shop Ownership Transfer Email

Hello,

Ownership transfer request of {{ $shopName }} has been created.

Current shop/store owner : {{ $previousOwnerName }}

Requested new owner : {{ $newOwnerName }}

Message : {{ $message }}

@component('mail::button', ['url' => $url ])
View dashboard
@endcomponent
Thanks,<br>
{{ config('app.name') }}
@endcomponent