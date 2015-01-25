define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('PhoneController', PhoneController);
    PhoneController.$inject = ['$ionicPopup', '$ionicPopover', '$scope', '$ionicLoading', '$ionicScrollDelegate', '$log', '$state', 'confirmService', 'CALLING_CODES'];
    function PhoneController($ionicPopup, $ionicPopover, $scope, $ionicLoading, $ionicScrollDelegate, $log, $state, confirmService, CALLING_CODES) {

        var vm = this;

        vm.countrycode = '1';
        vm.phone;
        vm.callingCodes;
        vm.countryFilterText;
        vm.submit = submit;
        vm.validatePhone = validatePhone;
        vm.openCodeSelector = openCodeSelector;
        vm.onSelectCode = onSelectCode;
        vm.filterCountries = filterCountries;
        vm.isReady = isReady;

        vm.test1 = function () {

        }

        var _popover;

        init();

        function init() {

            vm.callingCodes = CALLING_CODES.slice(0);
            vm.countryFilterText = '';
            $scope.vm = vm;

            $ionicPopover.fromTemplateUrl('js/phone/callingcodes.popover.tpl.html', {
                scope: $scope
            }).then(function (popover) {
                _popover = popover;
            });

            $scope.$on('$destroy', function () {
                _popover.remove();
            });

            $scope.$on('popover.hidden', function () {
                vm.countryFilterText = '';
                filterCountries();
            });

        }

        function filterCountries() {

            vm.callingCodes = CALLING_CODES.slice(0);

            vm.countryFilterText = vm.countryFilterText.replace(/[^a-z]/, '');

            if (vm.countryFilterText.length < 1) {
                return;
            }

            vm.callingCodes = vm.callingCodes.filter(function (el) {
                var srch = vm.countryFilterText.toLowerCase(),
                    text = el.country.toLowerCase();

                return text.indexOf(srch) === 0;

            });

            $ionicScrollDelegate.scrollTop();
        }

        function openCodeSelector($event) {
            vm.countryFilterText = '';
            filterCountries();
            _popover.show($event);
        }

        function onSelectCode(codeInfo) {
            vm.countrycode = codeInfo.code;
            _popover.hide();
        }

        function validatePhone() {
            var phoneRE = /[^0-9]/;
            var phone = vm.phone + '';
            if (phone) {
                phone = phone.replace(phoneRE, '');
            }
            vm.phone = +phone;
        }

        function isReady() {
            validatePhone();
            if (!vm.phone || !vm.countrycode) return false;
            var phone = "" + vm.countrycode + vm.phone;
            return phone.length > 6
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

            if (phone.length < 3) {

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

            confirmService.submitSMS(phone)
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