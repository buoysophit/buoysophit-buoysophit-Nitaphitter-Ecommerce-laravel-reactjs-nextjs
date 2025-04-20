@component('mail::message')
# Commission Rate Updated {{$shop->name}} shop.

Dear Admin,

The {{$shop->name}} shop's admin commission rate updated to {{ $balance->admin_commission_rate }}%:


The {{$shop->name}} shop's summary :

- Total Earnings: {{ $balance->total_earnings }}
- Admin Commission Rate: {{ $balance->admin_commission_rate }}
- Current Balance: {{ $balance->current_balance }}

Thank you for your business!

@endcomponent