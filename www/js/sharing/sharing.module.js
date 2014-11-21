define([
    "angular",
    "sharing/bike/sharing.bike.module",
    "sharing/mybikes/sharing.mybikes.module"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing', [
        'dropbike.sharing.bike',
        'dropbike.sharing.mybikes'
    ]);

    require([
        "sharing/sharing.controller",
        "sharing/sharing.routes.config"
    ]);

});