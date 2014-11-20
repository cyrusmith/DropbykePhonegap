define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.bike', []);

    require([
        "sharing/bike/sharing.bike.controller",
        "sharing/bike/sharing.bike.edit.controller",
        "sharing/bike/sharing.bike.edit.photo.controller",
        "sharing/bike/sharing.bike.edit.location.controller",
        "sharing/bike/sharing.bike.dataservice.factory"
    ]);

});