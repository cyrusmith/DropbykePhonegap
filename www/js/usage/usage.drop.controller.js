/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageDropController', UsageDropController);

    UsageDropController.$inject = ['rideData', '$localStorage', '$ionicPopup', '$state', 'geolocation', 'mapDataService', 'usageDataService', 'cameraUtil', '$timeout', 'BACKEND_URL'];

    function UsageDropController(rideData, $localStorage, $ionicPopup, $state, geolocation, mapDataService, usageDataService, cameraUtil, $timeout, BACKEND_URL) {

        var vm = this;
        vm.currentLocation;
        vm.zoom;
        vm.ride;
        vm.photo;
        vm.message;
        vm.distance;
        vm.lockPassword;
        vm.address;
        vm.loading;

        vm.pickPhoto = pickPhoto;
        vm.drop = drop;
        vm.getCurrentLocation = getCurrentLocation;
        vm.isReadyToDrop = isReadyToDrop;

        init();

        function init() {

            vm.currentLocation = null;
            vm.zoom = 16;
            vm.ride = rideData.ride;
            vm.photo = null;
            vm.message = null;
            vm.address = null;
            vm.loading = false;

            vm.photo = BACKEND_URL + '/images/rides/' + vm.ride.id + '.jpg?nocache=' + (new Date().getTime());

            getCurrentLocation();

        }

        function pickPhoto() {
            if (vm.loading) return;
            vm.loading = true;
            cameraUtil.pickAndUpload("camera", BACKEND_URL + "/api/rides/photo")
                .then(function () {
                    vm.photo = BACKEND_URL + '/images/rides/' + vm.ride.id + '.jpg?nocache=' + (new Date().getTime());
                    vm.ride.hasPhoto = true;
                }, function (error) {
                    $ionicPopup.show({
                        title: 'Error uploading photo',
                        subTitle: error,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    })
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function drop() {

            var errors = [];
            if (!vm.address) {
                errors.push('Address not set');
            }

            if (window.cordova && !vm.ride.hasPhoto) {
                errors.push('Photo not set');
            }

            if (!vm.message) {
                errors.push('Message not set');
            }

            if (!vm.currentLocation || !vm.currentLocation[0] || !vm.currentLocation[1]) {
                errors.push('Location not found');
            }


            if (errors.length) {
                $ionicPopup.show({
                    title: "Errors",
                    subTitle: errors.join('<br/>'),
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                return;
            }


            usageDataService.drop(vm.currentLocation[0], vm.currentLocation[1], vm.address, vm.lockPassword, vm.message, vm.distance)
                .then(function () {
                    $state.go('app.checkout');
                }, function (error) {
                    $ionicPopup.show({
                        title: "Error",
                        subTitle: error,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                });

        }

        function getCurrentLocation() {

            mapDataService.checkGPS()
                .then(function (isEnabled) {
                    if (!isEnabled) {
                        vm.locationError = "Please enable GPS to drop bike";

                        if (!window.cordova) {
                            $timeout(function () {
                                vm.locationError = null;
                            }, 3000);
                        }

                    }
                    else {
                        vm.locationError = null;
                    }
                });

            geolocation.getLocation({})
                .then(function (pos) {
                    vm.currentLocation = [pos.coords.latitude, pos.coords.longitude];
                    $localStorage.dropLocation = vm.currentLocation;

                    if (!vm.address) {
                        mapDataService.geodecode(pos.coords)
                            .then(function (address) {
                                if (address.length) {
                                    vm.address = address[0].formatted_address;
                                }
                            }, function (error) {
                                vm.locationError = "Error getting address. Please enter manually.";
                            });
                    }
                }, function (error) {
                    vm.currentLocation = null;
                    vm.locationError = "Current location not found. Please enable GPS.";
                });

        }

        function isReadyToDrop() {
            return !vm.locationError && !!vm.address && !!vm.message && (!!vm.ride.hasPhoto || !window.cordova);
        }

    }

});