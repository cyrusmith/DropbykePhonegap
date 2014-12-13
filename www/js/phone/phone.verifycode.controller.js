define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneVerifyCodeController', PhoneVerifyCodeController);

    PhoneVerifyCodeController.$inject = ['$ionicPopup', '$ionicLoading', '$localStorage', '$state', '$log', 'authService', 'confirmService', 'profileDataService'];

    function PhoneVerifyCodeController($ionicPopup, $ionicLoading, $localStorage, $state, $log, authService, confirmService, profileDataService) {

        var vm = this;

        vm.code = "";
        vm.submit = submit;
        vm.resendSMS = resendSMS;
        vm.changeNumber = changeNumber;

        function resendSMS() {

            if(!$localStorage.phone) {
                changeNumber();
            }

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Wait...'
            });

            confirmService.submitSMS()
                .then(function (result) {
                    $ionicLoading.hide();
                    $log.log("submitSMS result", result);
                    $state.go('app.phoneverifycode')
                }, function (error) {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: error,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                });

        }

        function changeNumber() {
            $state.go('app.phoneconfirm')
        }

        function submit() {

            if (!vm.code) {

                $ionicPopup.show({
                    title: 'Code not set',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });

                return;
            }

            confirmService.verifyCode(vm.code)
                .then(function (resp) {

                    var user = resp.user,
                        ride = resp.ride;

                    authService.setPhoneConfirmed(true);

                    if (user.cards && user.cards.length) {
                        authService.setHasPayment(true);
                        if (ride) {
                            $state.go('app.usageaccess');
                        }
                        else {
                            $state.go('app.search');
                        }
                    }
                    else {
                        $state.go('app.editcard');
                    }


                }, function (error) {
                    $ionicPopup.show({
                        title: '<span class="assertive"><i class="ion-alert-circled"></i>' + (error ? error : 'Invalid code') + '</span>',
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