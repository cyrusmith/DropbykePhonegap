define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneController', PhoneController);
    PhoneController.$inject = ['$ionicPopup', '$ionicLoading', '$localStorage', '$log', '$state', 'confirmService'];
    function PhoneController($ionicPopup, $ionicLoading, $localStorage, $log, $state, confirmService) {

        var vm = this;

        vm.phone = "";
        vm.submit = submit;

        function submit() {

            var phoneRE = /[^0-9]/,
                phone = (vm.phone + "").replace(phoneRE, '');

            if (phone.length < 11) {

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

            $localStorage.phone = vm.phone;

            confirmService.submitSMS(vm.phone)
                .then(function (result) {
                    $ionicLoading.hide();
                    $log.log("submitSMS result", result);
                    $localStorage.phone_verification_key = result.data.request_key;
                    $state.go('app.phoneverifycode')
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: 'Sending sms failed',
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