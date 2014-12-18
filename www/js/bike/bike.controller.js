/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.bike").controller("BikeController", BikeController);

    BikeController.$inject = ['bike', 'bikeDataService', 'mapDataService', 'mapDataServiceErrorCodes', 'usageDataService', '$ionicPopup', '$ionicLoading', '$state', '$timeout', 'BACKEND_URL'];

    function BikeController(bike, bikeDataService, mapDataService, mapDataServiceErrorCodes, usageDataService, $ionicPopup, $ionicLoading, $state, $timeout, BACKEND_URL) {

        var vm = this;

        vm.bike;
        vm.markers;
        vm.zoom;
        vm.bikeLocation;
        vm.location;
        vm.locationError;
        vm.isValidDistance;

        vm.getLocation = getLocation;
        vm.getAccess = getAccess;

        init();

        function init() {

            if (!bike || !bike.bike) {
                $state.go('app.search');
                return;
            }

            vm.bike = bike.bike;
            vm.bike.rating = parseInt(bike.bike.rating * 10) / 10;
            vm.bike.photo = BACKEND_URL + '/images/bikes/' + vm.bike.id + '.jpg';

            vm.bikeLocation = [vm.bike.lat, vm.bike.lng];
            vm.markers = [
                [vm.bike.lat, vm.bike.lng]
            ];
            vm.zoom = 17;

            getLocation();

        }

        function getLocation() {

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your location...'
            });

            mapDataService.getExactLocation()
                .then(function (pos) {
                    vm.location = [pos.latitude, pos.longitude];
                    vm.locationError = null;

                    return bikeDataService.isValidDistance(bike.bike.id, pos.latitude, pos.longitude);

                }, function (error) {
                    vm.location = null;
                    vm.locationError = error.message;
                    $timeout(function () {
                        vm.locationError = null;
                    }, 5000);

                    if (error.code === mapDataServiceErrorCodes.ERROR_LOCATION_ACCURACY) {
                        $ionicPopup.show({
                            title: 'Could not get accurate location',
                            subTitle: 'Make sure you\'re using GPS and try again by pressing <i class="icon ion-android-locate"></i>. You cannot get access to bike until your location is accurate enough.',
                            buttons: [{
                                type: 'button-assertive',
                                text: 'Ok'
                            }]
                        });
                    }

                }).then(function (isValidDistance) {
                    vm.isValidDistance = isValidDistance;
                    if (!isValidDistance) {
                        $ionicPopup.show({
                            title: 'Cannot access bike. You are too far.',
                            buttons: [{
                                type: 'button-energized',
                                text: 'Ok'
                            }]
                        });
                    }
                }, function (error) {
                    $ionicPopup.show({
                        title: error,
                        buttons: [{
                            'type': 'button-assertive',
                            text: 'Ok'
                        }]
                    });
                }).finally(function () {
                    $ionicLoading.hide();
                });

        }

        function getAccess() {

            if (!vm.location || vm.locationError || !vm.isValidDistance) {
                return;
            }

            $ionicPopup.show({
                title: 'Get bike access',
                subTitle: 'Bike usage time will start once you get access',
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Get access</b>',
                        type: 'button-positive',
                        onTap: function () {
                            return true;
                        }
                    }
                ]
            }).then(function (res) {
                if (res) {
                    usageDataService.startUsage(vm.bike.id, vm.location[0], vm.location[1])
                        .then(function () {
                            $state.go('app.usageaccess');
                        }, function (error) {
                            $ionicPopup.show({
                                title: 'Could not start usage',
                                subTitle: error ? error : '',
                                buttons: [
                                    {
                                        text: 'Ok',
                                        type: 'button-assertive'
                                    }
                                ]
                            })
                        });

                }
            });
        }


    }

});