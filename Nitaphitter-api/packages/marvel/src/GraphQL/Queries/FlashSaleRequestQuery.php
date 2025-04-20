<?php


namespace Marvel\GraphQL\Queries;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class FlashSaleRequestQuery
{
    public function fetchFlashSaleRequests($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@fetchFlashSalesRequests', $args);
    }
    public function fetchFlashSaleRequestedProducts($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@fetchRequestedProducts', $args);
    }
}
