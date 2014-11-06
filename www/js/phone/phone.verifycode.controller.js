define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneVerifyCodeController', PhoneVerifyCodeController);

    PhoneVerifyCodeController.$inject = ['$ionicPopup', '$ionicLoading', '$localStorage', '$state', '$log', 'confirmService'];

    function PhoneVerifyCodeController($ionicPopup, $ionicLoading, $localStorage, $state, $log, confirmService) {

        var vm = this;

        vm.code = "";
        vm.submit = submit;
        vm.resendSMS = resendSMS;
        vm.changeNumber = changeNumber;

        function resendSMS() {

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Wait...'
            });

            confirmService.submitSMS($localStorage.phone)
                .then(function (result) {
                    $ionicLoading.hide();
                    $log.log("submitSMS result", result);
                    $localStorage.phone_verification_key = result.data.request_key;
                    $state.go('app.phoneverifycode')
                }, function () {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: 'Failed to send sms',
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

            if (!$localStorage.phone_verification_key) {
                $ionicPopup.show({
                    title: 'Set your phone number first',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                $state.go('app.phoneconfirm');
                return;
            }

            confirmService.verifyCode(vm.code, $localStorage.phone_verification_key)
                .then(function (resp) {

                    $localStorage.phone = null;
                    $localStorage.phone_verification_key = null;

                    var user = resp.user,
                        ride = resp.ride;

                    if (!user.cardVerified) {
                        $state.go('app.addcard');
                    }
                    else if (ride) {
                        $state.go('app.usageaccess');
                    }
                    else {
                        $state.go('app.search');
                    }

                }, function () {
                    $ionicPopup.show({
                        title: '<span class="assertive"><i class="ion-alert-circled"></i>Invalid code</span>',
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