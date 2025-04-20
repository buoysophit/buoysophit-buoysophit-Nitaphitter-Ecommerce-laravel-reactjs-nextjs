<?php

namespace Marvel\Http\Controllers;

use Marvel\Exceptions\MarvelException;
use Marvel\Facades\Ai;
use Marvel\Http\Requests\AiDescriptionRequest;

class AiController extends CoreController
{

    public function generateDescription(AiDescriptionRequest $request): mixed
    {
        try {
            return Ai::generateDescription($request);
        } catch (MarvelException $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG, $e->getMessage());
        }
    }
}
