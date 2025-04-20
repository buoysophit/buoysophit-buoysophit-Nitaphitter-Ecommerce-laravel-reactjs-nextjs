<?php

namespace Marvel\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class MarvelBroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        Broadcast::routes();

        $this->loadBroadCastedRoutes();
    }

    public function loadBroadCastedRoutes(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Rest/Channel.php');
    }
}
