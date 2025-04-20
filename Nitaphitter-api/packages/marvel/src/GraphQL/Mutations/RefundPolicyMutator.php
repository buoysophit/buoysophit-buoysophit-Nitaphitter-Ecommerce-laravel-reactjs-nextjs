<?php


namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class RefundPolicyMutator
{
    public function storeRefundPolicy($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundPolicyController@store', $args);
    }
    public function updateRefundPolicy($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundPolicyController@updateRefundPolicy', $args);
    }
    public function deleteRefundPolicy($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\RefundPolicyController@deleteRefundPolicy', $args);
    }
}
