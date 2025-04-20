<?php

namespace Marvel\Listeners;

use App\Events\QuestionAnswered;
use App\Models\User;
use App\Notifications\NotifyQuestionAnswered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Marvel\Enums\EventType;
use Marvel\Traits\SmsTrait;

class SendQuestionAnsweredNotification implements ShouldQueue
{
    use SmsTrait;
    /**
     * Handle the event.
     *
     * @param  QuestionAnswered  $event
     * @return void
     */
    public function handle(QuestionAnswered $event)
    {
        $emailReceiver = $this->getWhichUserWillGetEmail(EventType::QUESTION_ANSWERED, $event->question->language ?? DEFAULT_LANGUAGE);
        if ($emailReceiver['customer'] && $event->question->customer) {
            $customer = User::findOrFail($event->question->user_id);
            $customer->notify(new NotifyQuestionAnswered($event->question));
        }
    }
}
