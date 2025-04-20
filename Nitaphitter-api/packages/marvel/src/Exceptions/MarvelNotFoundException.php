<?php

namespace Marvel\Exceptions;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class MarvelNotFoundException extends HttpException
{
    /**
     * Create a new "Not Found" exception instance for REST Client.
     *
     * @param  string  $message
     * @param  \Throwable|null  $previous
     * @param  array  $headers
     * @param  int  $code
     * @return void
     */
    public function __construct($message = NOT_FOUND, Throwable $previous = null, array $headers = [], $code = 0)
    {
        parent::__construct(Response::HTTP_NOT_FOUND, $message, $previous, $headers, $code);
    }
}
