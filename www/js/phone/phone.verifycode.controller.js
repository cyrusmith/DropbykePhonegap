define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneVerifyCodeController', PhoneVerifyCodeController);

    PhoneVerifyCodeController.$inject = ['$ionicPopup', '$state', 'confirmService'];

    function PhoneVerifyCodeController($ionicPopup, $state, confirmService) {

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

                var myPopup = $ionicPopup.show({
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