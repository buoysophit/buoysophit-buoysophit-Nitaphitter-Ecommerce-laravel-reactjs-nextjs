<?php


namespace Marvel\GraphQL\Queries;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class FlashSaleQuery
{
    public function fetchFlashSales($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleController@fetchFlashSales', $args);
    }
    public function fetchProductsByFlashSale($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleController@fetchProductsByFlashSale', $args);
    }
    public function fetchFlashSaleInfoByProductID($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleController@getFlashSaleInfoByProductID', $args);
    }
}
