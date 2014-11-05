/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.bike").controller("CheckoutController", CheckoutController);

    CheckoutController.$inject = ['rideData', 'usageDataService', 'checkoutDataService', '$localStorage', '$stateParams', '$ionicLoading', '$ionicPopup', '$state', 'BACKEND_URL'];

    function CheckoutController(rideData, usageDataService, checkoutDataService, $localStorage, $stateParams, $ionicLoading, $ionicPopup, $state, BACKEND_URL) {

        var vm = this;
        vm.photo = BACKEND_URL + '/images/rides/' + rideData.ride.id + '.jpg';
        vm.rating = 0;
        vm.bike = rideData.bike;
        vm.ride = rideData.ride;
        vm.totalTime = 0;

        vm.checkout = checkout;

        console.log("CheckoutController", rideData);

        init();

        function init() {
            var startTime = vm.ride.startTime, stopTime = vm.ride.stopTime;

            var time = parseInt((stopTime - startTime) / 1000),
                s = time % 60,
                h = parseInt(time / 3600),
                m = parseInt(time / 60) % 60;

            vm.totalTime = nn(h) + ":" + nn(m) + ":" + nn(s);
            vm.totalPrice = Math.ceil(time * vm.bike.priceRate * 100 / 3600) / 100;
        }

        function checkout() {

            if (!vm.rating) {
                $ionicPopup.show({
                    title: 'Please set rating',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
            else {
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i> Loading...'
                });
                checkoutDataService.checkout(vm.ride.id, vm.rating)
                    .finally(function () {
                        $ionicLoading.hide();
                        $state.go('app.search');
                    });

            }

        }

        function nn(num) {
            return num > 9 ? num + "" : "0" + num;
        }

    }

});


