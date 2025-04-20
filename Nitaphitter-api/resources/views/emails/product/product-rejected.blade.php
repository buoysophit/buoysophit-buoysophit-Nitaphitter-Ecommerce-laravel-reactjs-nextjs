{{--$order collection is available here--}}

@component('mail::message')
# Review is successful!

Your Product is Rejected. Checked your product information or contact with admin.

@component('mail::button', ['url' => $url ])
View Product
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent