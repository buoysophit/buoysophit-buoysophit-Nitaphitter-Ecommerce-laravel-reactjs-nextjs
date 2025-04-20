
@component('mail::message')
# Maintenance Reminder Email
Message: Due to our regular site maintenance, this site will be down from {{ $start }} to {{ $until }}. We apologize for any inconvenience caused during this period. <br>
@component('mail::button', ['url' => $url ])
    View dashboard
@endcomponent
Thanks,<br>
{{ config('app.name') }}
@endcomponent
