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

    CheckoutController.$inject = ['rideData', 'checkoutDataService', '$localStorage', '$ionicLoading', '$ionicPopup', '$state', 'BACKEND_URL', 'facebook', 'WEBSITE'];

    function CheckoutController(rideData, checkoutDataService, $localStorage, $ionicLoading, $ionicPopup, $state, BACKEND_URL, facebook, WEBSITE) {

        console.log("CheckoutController", rideData);

        var vm = this;
        vm.photo;
        vm.rating;
        vm.bike;
        vm.ride;
        vm.totalTime;
        vm.currentLocation;
        vm.markers;
        vm.zoom;
        vm.path;
        vm.bounds;

        vm.checkout = checkout;

        init();

        function init() {

            if (!rideData) {
                return;
            }

            vm.photo = BACKEND_URL + '/images/rides/' + rideData.ride.id + '.jpg';
            vm.rating = 5;
            vm.bike = rideData.bike;
            vm.bike.rating = parseInt(rideData.bike.rating * 10) / 10;
            vm.ride = rideData.ride;

            vm.zoom = 10;
            vm.currentLocation = [vm.ride.stopLat, vm.ride.stopLng];
            vm.markers = [
                [vm.ride.startLat, vm.ride.startLng]
            ];

            vm.path = [vm.markers[0], vm.currentLocation];

            updateBounds();

            var startTime = vm.ride.startTime, stopTime = vm.ride.stopTime;

            var time = parseInt((stopTime - startTime) / 1000),
                s = time % 60,
                h = parseInt(time / 3600),
                m = parseInt(time / 60) % 60;

            vm.totalTime = nn(h) + ":" + nn(m) + ":" + nn(s);
            vm.totalPrice = vm.ride.sum / 100;

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
                    .then(function () {
                        $ionicPopup.show({
                            title: 'Checkout successful',
                            buttons: [
                                {
                                    text: 'Ok',
                                    type: 'button-balanced'
                                }
                            ]
                        }).then(function () {
                                $localStorage.dropLocation = null;
                                if (rideData.user.facebookId && rideData.user.shareFacebook) {
                                    facebook.postUpdate("I got a ride on Dropbike", "Dropbyke is a bike sharing service", rideData.user.name, WEBSITE, BACKEND_URL + '/images/rides/' + vm.ride.id + '.jpg')
                                        .finally(function () {
                                            $state.go('app.search');
                                        });
                                }
                                else {
                                    $state.go('app.search');
                                }

                            });
                    }, function (resp) {
                        $ionicPopup.show({
                            title: 'Checkout error',
                            subTitle: resp.data.error ? resp.data.error : '',
                            buttons: [
                                {
                                    text: 'Ok',
                                    type: 'button-assertive'
                                }
                            ]
                        });
                    })
                    .finally(function () {
                        $ionicLoading.hide();
                    });

            }

        }

        function nn(num) {
            return num > 9 ? num + "" : "0" + num;
        }


        function updateBounds() {

            if (!vm.currentLocation || !vm.ride) return;
            var sw = {}, ne = {};

            var curLng = vm.currentLocation[1], curLat = vm.currentLocation[0];

            if (curLng < vm.ride.startLng) {
                sw.lng = curLng;
                ne.lng = vm.ride.startLng;
            }
            else {
                sw.lng = vm.ride.startLng;
                ne.lng = curLng;
            }

            if (curLat < vm.ride.startLat) {
                sw.lat = curLat;
                ne.lat = vm.ride.startLat;
            }
            else {
                sw.lat = vm.ride.startLat;
                ne.lat = curLat;
            }

            console.log("Upd bounds to ", {
                "sw": sw,
                "ne": ne
            });

            vm.bounds = {
                "sw": sw,
                "ne": ne
            }

        }

    }

});


