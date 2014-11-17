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

    BikeController.$inject = ['bike', 'mapDataService', 'usageDataService', '$ionicPopup', '$ionicLoading', '$state', 'BACKEND_URL'];

    function BikeController(bike, mapDataService, usageDataService, $ionicPopup, $ionicLoading, $state, BACKEND_URL) {

        var vm = this;

        vm.bike;
        vm.markers;
        vm.zoom;
        vm.bikeLocation;
        vm.location;
        vm.locationError;

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
                },function (error) {
                    vm.location = null;
                    vm.locationError = error;
                }).finally(function () {
                    $ionicLoading.hide();
                });

        }

        function getAccess() {

            if (!vm.location || vm.locationError) {
                return;
            }

            $ionicPopup.show({
                title: 'Get bike access',
                subTitle: 'Bike usage time will start once you get access',
                buttons: [
                    { text: 'Cancel' },
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
                        usageDataService.startUsage(vm.bike.id)
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