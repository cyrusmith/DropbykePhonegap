/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.checkout", []);

    require([
        "checkout/checkout.controller",
        "checkout/checkout.dataservice.factory",
        "checkout/checkout.directive"
    ]);

});