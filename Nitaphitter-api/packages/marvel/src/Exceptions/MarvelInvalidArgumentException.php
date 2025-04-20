<?php

namespace Marvel\Exceptions;

use InvalidArgumentException;
use Throwable;

class MarvelInvalidArgumentException extends InvalidArgumentException
{
    /**
     * Constructor for the custom invalid argument exception.
     *
     * @param string         $message  The exception message (default: 'Invalid argument').
     * @param int            $code     The exception code (default: 0).
     * @param Throwable|null $previous The previous exception if chaining (default: null).
     */
    public function __construct($message = 'Invalid argument', $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
