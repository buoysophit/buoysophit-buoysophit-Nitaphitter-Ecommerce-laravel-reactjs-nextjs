@component('mail::message')

# {{$message }}

Message:  {{ $body }}.

We apologize for any inconvenience caused during this period. <br>

@component('mail::button', ['url' => $url ])
View shop
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent