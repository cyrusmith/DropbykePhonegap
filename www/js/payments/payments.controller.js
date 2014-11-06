define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.card').controller('PaymentsController', PaymentsController);
    PaymentsController.$inject = ['profile'];

    function PaymentsController(profile) {

        console.log("PaymentsController", profile);

        var vm = this;

        vm.cardName = profile.user.cardName;
        vm.cardHidden = hideCard(profile.user.cardNumber);

        function hideCard(number) {
            var res = "";
            if (number.length >= 8) {
                res += number.substr(0, 4);
            }
            res += " *** ";
            if (number.length > 4) {
                res += number.substr(number.length - 4, number.length);
            }
            return res;
        }

    }

});