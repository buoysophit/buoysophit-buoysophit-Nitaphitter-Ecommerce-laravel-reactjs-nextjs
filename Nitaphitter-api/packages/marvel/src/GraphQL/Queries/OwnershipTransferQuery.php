<?php


namespace Marvel\GraphQL\Queries;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class OwnershipTransferQuery
{
    public function fetchOwnershipTransfer($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\OwnershipTransferController@fetchOwnershipTransferHistories', $args);
    }

    public function fetchSingleOwnershipTransfer($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\OwnershipTransferController@fetchOwnerTransferHistory', $args);
    }
}


