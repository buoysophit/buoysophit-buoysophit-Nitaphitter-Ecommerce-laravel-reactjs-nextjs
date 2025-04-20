<?php

namespace Marvel\Ai;

interface AiInterface
{
  public function generateDescription(object $request): mixed;
}
