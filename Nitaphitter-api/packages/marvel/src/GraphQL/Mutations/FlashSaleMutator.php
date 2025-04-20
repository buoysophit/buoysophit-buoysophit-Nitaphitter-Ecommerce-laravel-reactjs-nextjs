<?php


namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class FlashSaleMutator
{
    public function storeFlashSale($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleController@store', $args);
    }
    public function updateFlashSale($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleController@updateFlashSale', $args);
    }
    public function deleteFlashSale($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleController@deleteFlashSale', $args);
    }
}
