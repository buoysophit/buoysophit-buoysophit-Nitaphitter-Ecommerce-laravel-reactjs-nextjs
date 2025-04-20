<?php


namespace Marvel\GraphQL\Queries;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class TermsConditionsQuery
{
    public function fetchTermsConditions($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\TermsAndConditionsController@fetchTermsAndConditions', $args);
    }
}
