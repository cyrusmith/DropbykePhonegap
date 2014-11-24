define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.mybikes', []);

    require([
        "sharing/mybikes/sharing.mybikes.controller",
        "sharing/mybikes/sharing.mybikes.dataservice.factory"
    ]);

});