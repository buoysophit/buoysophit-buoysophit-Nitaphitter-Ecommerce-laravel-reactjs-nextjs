<?php

namespace Marvel\Ai;


class Ai
{
  public $ai;

  public function __construct(AiInterface $ai)
  {
    $this->ai = $ai;
  }

  /**
   * generateDescription
   *
   * @param  object $request
   * @return array
   */
  public function generateDescription($request)
  {
    return $this->ai->generateDescription($request);
  }

}
