define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneController', PhoneController);
    PhoneController.$inject = ['$ionicPopup', '$ionicLoading', '$log', '$state', 'confirmService'];
    function PhoneController($ionicPopup, $ionicLoading, $log, $state, confirmService) {

        var vm = this;

        vm.phone = "";
        vm.submit = submit;

        function submit() {

            var phoneRE = /[^0-9]/,
                phone = vm.phone.replace(phoneRE, '');

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

            confirmService.submitSMS(vm.phone)
                .then(function (result) {
                    $ionicLoading.hide();
                    $log.log("submitSMS result", result);
                    $state.go('app.phoneverifycode')
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: 'Could not verify code',
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