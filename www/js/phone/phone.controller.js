define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneController', PhoneController);
    PhoneController.$inject = ['$ionicPopup', '$ionicLoading', '$log', '$state', 'confirmService'];
    function PhoneController($ionicPopup, $ionicLoading, $log, $state, confirmService) {

        var vm = this;

        vm.countrycode;
        vm.phone;
        vm.submit = submit;
        vm.validateCountryCode = validateCountryCode;
        vm.validatePhone = validatePhone;

        function validateCountryCode() {

            var code = vm.countrycode + '';

            if (code && code.length > 1) {
                vm.countrycode = +code.substr(0, 1)
            }
        }

        function validatePhone() {
            var phoneRE = /[^0-9]/;
            var phone = vm.phone + '';
            if (phone) {
                phone = phone.replace(phoneRE, '');
                if (phone.length > 10) {
                    phone = phone.substr(0, 10);
                }
            }
            vm.phone = +phone;
        }

        function submit() {

            if (!vm.countrycode) {
                $ionicPopup.show({
                    title: 'Country code not set',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                return;
            }

            if (!vm.phone) {
                $ionicPopup.show({
                    title: 'Phone number not set',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                return;
            }

            var phone = "" + vm.countrycode + vm.phone;

            if (phone.length !== 11) {

                $ionicPopup.show({
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

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Wait...'
            });

            confirmService.submitSMS(vm.phone)
                .then(function (result) {
                    $ionicLoading.hide();
                    $log.log("submitSMS result", result);
                    $state.go('app.phoneverifycode')
                }, function (error) {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: error ? error : 'Sending sms failed',
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                });
        }

    }

});