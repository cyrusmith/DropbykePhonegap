/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageDropController', UsageDropController);

    UsageDropController.$inject = ['rideData', '$localStorage', '$ionicPopup', '$state', 'geolocation', 'mapDataService', 'usageDataService', 'cameraUtil', 'BACKEND_URL'];

    function UsageDropController(rideData, $localStorage, $ionicPopup, $state, geolocation, mapDataService, usageDataService, cameraUtil, BACKEND_URL) {

        var vm = this;
        vm.currentLocation = null;
        vm.zoom = 16;
        vm.ride = null;
        vm.photo = null;
        vm.message = null;
        vm.lockPassword = null;
        vm.address = null;

        vm.pickPhoto = pickPhoto;
        vm.drop = drop;
        vm.getCurrentLocation = getCurrentLocation;

        init();

        function init() {

            vm.ride = rideData.ride;
            vm.lockPassword = rideData.bike.lockPassword;

            vm.photo = BACKEND_URL + '/images/rides/' + vm.ride.id + '.jpg?nocache=' + (new Date().getTime());

            getCurrentLocation();

        }

        function pickPhoto() {
            cameraUtil.pickAndUpload("cemera", BACKEND_URL + "/api/rides/photo")
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

            if (!vm.lockPassword) {
                errors.push('Lock password not set');
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


            usageDataService.drop(vm.currentLocation[0], vm.currentLocation[1], vm.address, vm.lockPassword, vm.message)
                .then(function (resp) {
                    $localStorage.lastRideId = resp.ride.id;
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
            geolocation.getLocation({})
                .then(function (pos) {
                    vm.currentLocation = [pos.coords.latitude, pos.coords.longitude];
                    if (!vm.address) {
                        mapDataService.geodecode(pos.coords)
                            .then(function (address) {
                                if (address.length) {
                                    vm.address = address[0].formatted_address;
                                }
                            }, function (error) {
                            });
                    }
                }, function (error) {
                    $ionicPopup.show({
                        title: error,
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