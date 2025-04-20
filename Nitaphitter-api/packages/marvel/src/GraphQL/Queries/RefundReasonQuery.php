<?php


namespace Marvel\GraphQL\Queries;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class RefundReasonQuery
{
    public function fetchRefundReasons($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundReasonController@fetchRefundReasons', $args);
    }
}
