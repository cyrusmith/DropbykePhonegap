define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.payments', []);

    require([
        "payments/payments.controller",
        "payments/payments.dataservice.factory"
    ]);

});