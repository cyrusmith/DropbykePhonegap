define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.search', []);

    require([
        "search/search.controller",
        "search/search.map.directive",
        "search/search.dataservice.factory"
    ]);

});