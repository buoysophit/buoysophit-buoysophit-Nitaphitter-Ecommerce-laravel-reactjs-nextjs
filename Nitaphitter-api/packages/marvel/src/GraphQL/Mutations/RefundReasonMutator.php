<?php


namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class RefundReasonMutator
{
    public function storeRefundReason($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundReasonController@store', $args);
    }
    public function updateRefundReason($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundReasonController@refundReasonUpdate', $args);
    }
    public function deleteRefundReason($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundReasonController@deleteRefundReason', $args);
    }
}
