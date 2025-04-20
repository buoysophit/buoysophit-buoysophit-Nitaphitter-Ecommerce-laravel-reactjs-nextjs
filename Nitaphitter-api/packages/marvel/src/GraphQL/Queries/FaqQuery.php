<?php


namespace Marvel\GraphQL\Queries;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;


class FaqQuery
{
    public function fetchFaqs($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FaqsController@fetchFAQs', $args);
    }
}
