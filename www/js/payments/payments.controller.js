define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.payments').controller('PaymentsController', PaymentsController);

    PaymentsController.$inject = ['profile'];

    function PaymentsController(profile) {

        console.log("PaymentsController", profile);

        var vm = this;

        vm.cards = profile.cards;

    }

});