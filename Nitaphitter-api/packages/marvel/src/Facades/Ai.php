<?php

namespace Marvel\Facades;

use Illuminate\Support\Facades\Facade;

class Ai extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'ai';
    }
}
