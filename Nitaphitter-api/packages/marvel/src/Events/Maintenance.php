<?php


namespace Marvel\Events;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\FlashSale;
use Marvel\Database\Models\Order;

class Maintenance 
{


    public $language;


    /**
     * The function is a constructor that sets the value of the "language" property.
     * 
     * @param string language The "language" parameter is a string that represents the programming
     * language. It is passed to the constructor of a class.
     */
    public function __construct(string $language)
    {
        $this->language = $language;
    }
}
