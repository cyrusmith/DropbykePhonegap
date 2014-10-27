define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.card').controller('CardController', CardController);
    CardController.$inject = ['$ionicPopup', '$ionicLoading', '$localStorage', '$log', '$state', 'cardService', 'UserModel'];

    function CardController($ionicPopup, $ionicLoading, $localStorage, $log, $state, cardService, UserModel, loggedUser) {

        var vm = this;

        vm.number = "";
        vm.name = "";
        vm.expire = "";
        vm.cvc = "";

        vm.submit = submit;

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

            cardService.addCard(
                    vm.number,
                    vm.name,
                    vm.expire,
                    vm.cvc)
                .then(function (result) {
                    $ionicLoading.hide();

                    var user = new UserModel();
                    user.load();
                    user.isCardConfirmed = true;
                    user.save();

                    $state.go('app.addcard');

                }, function (resp) {
                    $ionicLoading.hide();

                    if(resp.data && resp.data.error) {
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