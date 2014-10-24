define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone', []);

    require([
        "phone/phone.controller",
        "phone/phone.confirmservice.factory",
        "phone/phone.verifycode.controller"
    ]);

});