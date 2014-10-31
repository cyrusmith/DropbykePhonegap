define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('map', []);

    require([
        "map/map.directive",
        "map/map.dataservice.factory"
    ]);

});