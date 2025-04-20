<?php

namespace Marvel\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class MaintenanceReminder extends Notification implements ShouldQueue
{
    use Queueable;

    public $settings;

    /**
     * Create a new notification instance.
     *
     * @param $settings
     * @return void
     */
    public function __construct($settings)
    {
        $this->settings = $settings;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = config('shop.dashboard_url');
        $start = Carbon::parse($this->settings->options['maintenance']['start'])->toFormattedDateString();
        $until = Carbon::parse($this->settings->options['maintenance']['until'])->toFormattedDateString();
        return (new MailMessage)
            ->subject(APP_NOTICE_DOMAIN . ' Maintenance Reminder')
            ->priority(1)
            ->markdown(
                'emails.maintenance.reminder',
                [
                    'start' => $start,
                    'until' => $until,
                    'url' => $url
                ]
            );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
