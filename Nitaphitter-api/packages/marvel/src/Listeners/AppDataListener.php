<?php

namespace Marvel\Listeners;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Marvel\Console\MarvelVerification;
use Marvel\Database\Models\Settings;
use Marvel\Events\ProcessUserData;

class AppDataListener
{
    private $appData;
    private $config;
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(MarvelVerification $config)
    {
        $this->config =  $config;
    }

    /**
     * Handle the event.
     *
     * @param  ProcessUserData  $event
     * @return void
     */
    public function handle(ProcessUserData $event)
    {
        $last_checking_time = $this->config->getLastCheckingTime();
        $lastCheckingTimeDifferenceFromNow = Carbon::parse($last_checking_time)->diffInHours(Carbon::now());
        if ($lastCheckingTimeDifferenceFromNow < 12) return;
        $key = $this->config->getPrivateKey();
        $language = isset(request()['language']) ? request()['language'] : DEFAULT_LANGUAGE;
        $this->config->verify($key)->modifySettingsData($language);
    }
}
