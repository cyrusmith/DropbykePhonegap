define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneVerifyCodeController', PhoneVerifyCodeController);

    PhoneVerifyCodeController.$inject = ['$ionicPopup', '$localStorage', '$state', 'confirmService', 'UserModel'];

    function PhoneVerifyCodeController($ionicPopup, $localStorage, $state, confirmService, UserModel) {

        var vm = this;

        vm.code = "";
        vm.submit = submit;
        vm.resendSMS = resendSMS;
        vm.changeNumber = changeNumber;

        function resendSMS() {
            alert('No implemeted');
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

            if(!$localStorage.phone_verification_key) {
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
                .then(function () {

                    $ionicPopup.show({
                        title: '<span class="balanced"><i class="ion-checkmark-round"></i> Code verified</span>',
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-balanced'
                            }
                        ]
                    });

                    var user = new UserModel();
                    user.load();
                    user.isPhoneConfirmed = true;
                    user.save();

                    $state.go('app.addcard');

                }, function() {
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