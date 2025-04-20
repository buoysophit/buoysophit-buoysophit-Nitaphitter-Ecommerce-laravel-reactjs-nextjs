<?php


namespace Marvel\GraphQL\Mutation;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class AiMutator
{
    public function generateDescription($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\AiController@generateDescription', $args);
    }
}
