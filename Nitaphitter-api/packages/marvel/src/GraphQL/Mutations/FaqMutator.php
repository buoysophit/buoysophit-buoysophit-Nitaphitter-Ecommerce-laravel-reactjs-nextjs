<?php


namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

// TODO use this as a graphql resolver and fix the issues
class FaqMutator
{
    public function storeFaq($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FaqsController@store', $args);
    }
    public function updateFaq($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FaqsController@updateFaqs', $args);
    }
    public function deleteFaq($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\FaqsController@deleteFaq', $args);
    }
}
