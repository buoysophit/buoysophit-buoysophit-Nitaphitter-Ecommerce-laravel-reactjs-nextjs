<?php

namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class FlashSaleRequestsMutator
{
    public function storeFlashSaleRequest($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@store', $args);
    }
    public function updateFlashSaleRequest($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@updateFlashSaleRequest', $args);
    }
    public function deleteFlashSaleRequest($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@deleteFlashSaleRequest', $args);
    }
    public function approveFlashSaleRequest($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@approveFlashSaleProductsRequest', $args);
    }
    public function disApproveFlashSaleRequest($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FlashSaleVendorRequestController@disapproveFlashSaleProductsRequest', $args);
    }
}
