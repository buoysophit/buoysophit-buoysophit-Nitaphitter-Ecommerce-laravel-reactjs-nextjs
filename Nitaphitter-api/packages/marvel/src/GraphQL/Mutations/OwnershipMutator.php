<?php


namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class OwnershipMutator
{
    public function updateOwnership($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\OwnershipTransferController@updateOwnershipTransfer', $args);
    }
    public function deleteOwnership($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\OwnershipTransferController@deleteOwnershipTransfer', $args);
    }
}