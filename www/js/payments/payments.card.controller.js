define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.payments').controller('PaymentsCardController', PaymentsCardController);
    PaymentsCardController.$inject = ['profile', 'authService', '$ionicPopup', '$ionicLoading', '$state', '$stateParams', 'paymentsDataService'];

    function PaymentsCardController(profile, authService, $ionicPopup, $ionicLoading, $state, $stateParams, paymentsDataService) {

        console.log("CardEditController", profile, $stateParams);

        var vm = this;

        vm.number;
        vm.name;
        vm.expire;
        vm.cvc;
        vm.isEdit = true;

        vm.submit = submit;

        init();

        function init() {

            var cardId = $stateParams.cardId;

            for (var i = 0; i < profile.cards.length; i++) {
                if (cardId == profile.cards[i].id) {
                    vm.number = profile.cards[i].number;
                    vm.name = profile.cards[i].name;
                    vm.expire = profile.cards[i].expire;
                    vm.cvc = profile.cards[i].cvc;
                    break;
                }
            }

        }

        vm.validateExpire = function () {
            if (vm.expire.length == 3 && vm.expire[2] != '/') {
                vm.expire = vm.expire.substr(0, 2) + '/';
            }
            if (vm.expire.length > 5) {
                vm.expire = vm.expire.substr(0, 5);
            }
        };

        vm.validateCVC = function () {

            if (vm.cvc.length > 3) {
                vm.cvc = vm.cvc.substr(0, 3);
            }
        };

        function submit() {

            var valid = !!vm.number && !!vm.name && !!vm.expire && !!vm.cvc;

            if (!valid) {

                $ionicPopup.show({
                    title: 'Invalid card data',
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

            paymentsDataService.editCard(
                    vm.number,
                    vm.name,
                    vm.expire,
                    vm.cvc)
                .then(function (result) {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        title: "Card data successfully saved",
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-balanced'
                            }
                        ]
                    }).then(function () {
                            if (!authService.isHasPayment()) {
                                authService.setHasPayment(true);
                                $state.go('app.search');
                            }
                            else {
                                $state.go('app.payments');
                            }

                        });


                }, function (resp) {
                    $ionicLoading.hide();

                    if (resp.data && resp.data.error) {
                        $ionicPopup.show({
                            title: resp.data.error,
                            buttons: [
                                {
                                    text: 'Ok',
                                    type: 'button-assertive'
                                }
                            ]
                        });
                    }

                });
        }

    }

});