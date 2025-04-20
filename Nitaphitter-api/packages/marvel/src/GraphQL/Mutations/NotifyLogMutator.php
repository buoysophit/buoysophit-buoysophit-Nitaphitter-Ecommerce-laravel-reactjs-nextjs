<?php


namespace Marvel\GraphQL\Mutation;


use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Marvel\Facades\Shop;


class NotifyLogMutator
{
    public function readNotifyLogs($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\NotifyLogsController@readNotifyLogs', $args);
    }
    public function notifyLogAllRead($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\NotifyLogsController@readAllNotifyLogs', $args);
    }
    public function deleteNotifyLogs($rootValue, array $args, GraphQLContext $context)
    {
        return Shop::call('Marvel\Http\Controllers\NotifyLogsController@deleteNotifyLogs', $args);
    }
}
