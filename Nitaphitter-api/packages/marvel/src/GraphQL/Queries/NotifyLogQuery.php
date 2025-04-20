<?php


namespace Marvel\GraphQL\Queries;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;

class NotifyLogQuery
{
    public function fetchNotifyLogs($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\NotifyLogsController@fetchNotifyLogs', $args);
    }
}
