define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneController', PhoneController);
    PhoneController.$inject = ['$ionicPopup', '$state', 'confirmService'];
    function PhoneController($ionicPopup, $state, confirmService) {

        var vm = this;

        vm.phone = "";
        vm.submit = submit;

        function submit() {

            var phoneRE = /[^0-9]/,
                phone = vm.phone.replace(phoneRE, '');

            if (phone.length < 11) {

                var myPopup = $ionicPopup.show({
                    title: 'Invalid phone number',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });

                return;
            }

            confirmService.submitSMS(vm.phone)
                .then(function() {
                    $state.go('app.phoneverifycode')
                });
        }

    }

});