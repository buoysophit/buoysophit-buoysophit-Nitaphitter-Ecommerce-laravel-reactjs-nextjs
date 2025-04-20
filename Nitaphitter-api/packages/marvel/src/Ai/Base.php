<?php

namespace Marvel\Ai;

use Marvel\Database\Models\Settings;
use Symfony\Component\HttpKernel\Exception\HttpException;

abstract class Base
{
  public $enable_ai;

  public function __construct()
  {
    $settings = Settings::first();
    $this->enable_ai = $settings->options['useAi'];
    if (!$this->enable_ai) {
      throw new HttpException(400, PLEASE_ENABLE_OPENAI_FROM_THE_SETTINGS);
    }
  }
}
