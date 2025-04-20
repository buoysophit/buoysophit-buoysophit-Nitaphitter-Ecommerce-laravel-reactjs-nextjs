<?php

use Illuminate\Support\Facades\Broadcast;
use Marvel\Database\Models\StoreNotice;
use Marvel\Database\Models\User;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('store_notice.created.{userID}', function ($user, $userID) {
    return (int) $user->id === (int) $userID;
}, ['middleware' => ['auth:sanctum']]);

Broadcast::channel('order.created.{userID}', function ($user, $userID) {
    return (int) $user->id === (int) $userID;
}, ['middleware' => ['auth:sanctum']]);


Broadcast::channel(
    'message.created.{userID}',
    function ($user, $userID) {
        return (int) $user->id === (int) $userID;
    },
    ['middleware' => ['auth:sanctum']]
);
