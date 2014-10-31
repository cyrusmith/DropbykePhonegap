/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.bike", []);

    require([
        "bike/bike.controller",
        "bike/bike.dataservice.factory"
    ]);

});