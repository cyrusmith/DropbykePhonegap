define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.history', []);

    require([
        "sharing/history/sharing.history.controller",
        "sharing/history/sharing.history.list.controller",
        "sharing/history/sharing.history.item.controller",
        "sharing/history/sharing.history.item.map.controller",
        "sharing/history/sharing.history.dataservice.factory"
    ]);

});