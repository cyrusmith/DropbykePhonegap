define([
    "angular",
    "sharing/bike/sharing.bike.module"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing', [
        'dropbike.sharing.bike'
    ]);

    require([
        "sharing/sharing.controller",
        "sharing/sharing.routes.config"
    ]);

});