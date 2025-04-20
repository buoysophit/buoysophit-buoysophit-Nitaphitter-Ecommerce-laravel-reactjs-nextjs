@component('mail::message')
# Product Update Notice

Hello {{ $user->name }},

One new update is available of this product {{ $product->name }}. You can download the update from your user profile's download section.
For more details, you can visit the product link.

@component('mail::button', ['url' => $url ])
View product
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent