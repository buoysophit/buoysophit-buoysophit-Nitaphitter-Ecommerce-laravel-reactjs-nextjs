{{--$order collection is available here--}}

@component('mail::message')
# Review is successful!

Your Product is Approved. Now you can publish or unpublish your product!.

@component('mail::button', ['url' => $url ])
View Product
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent