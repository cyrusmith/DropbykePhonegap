/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageDropController', UsageDropController);

    UsageDropController.$inject = ['rideData', '$localStorage', '$ionicPopup', '$ionicLoading', '$state', 'mapDataService', 'usageDataService', '$timeout', 'BACKEND_URL'];

    function UsageDropController(rideData, $localStorage, $ionicPopup, $ionicLoading, $state, mapDataService, usageDataService, $timeout, BACKEND_URL) {

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

            if ($localStorage.dropBikePageHolder) {
                vm.message = $localStorage.dropBikePageHolder.message;
                vm.currentLocation = $localStorage.dropBikePageHolder.currentLocation;
                $localStorage.dropBikePageHolder = null;
            }

            if(!vm.currentLocation) {
                getCurrentLocation();
            }

            if (!vm.ride.hasPhoto || !vm.message) {
                $ionicPopup.show({
                    title: "Warning",
                    subTitle: ["<h5>To drop your bike wherever you like please follow the instructions:</h5>",
                        "<ul>",
                        "<li>Lock bike at any eligible public place, e.g. public bike stan</li>",
                        "<li>Take photo of locked bike to help next rider find it</li>",
                        "<li>Leave message for next rider</li>",
                        "</ul>"].join(""),
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-energized'
                        }
                    ]
                });
            }

        }

        function pickPhoto() {
            $localStorage.dropBikePageHolder = {
                message: vm.message,
                currentLocation: vm.currentLocation
            };
            $state.go('app.usagephoto');
        }

        function drop() {

            $localStorage.dropBikePageHolder = null;

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
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your location...'
            });
            mapDataService.getExactLocation()
                .then(function (pos) {
                    vm.locationError = null;

                    vm.currentLocation = [pos.latitude, pos.longitude];
                    $localStorage.dropLocation = vm.currentLocation;

                    if (!vm.address) {
                        mapDataService.geodecode(pos)
                            .then(function (address) {
                                if (address.length) {
                                    vm.address = address[0].formatted_address;
                                }
                            }, function (error) {
                                vm.locationError = "Error getting address. Please update by hand.";
                                $timeout(function () {
                                    vm.locationError = null
                                }, 10000);
                            });
                    }


                },function (error) {
                    vm.locationError = error;
                }).finally(function () {
                    $ionicLoading.hide();
                });

        }

        function isReadyToDrop() {
            return !vm.locationError && !!vm.address && !!vm.message && (!!vm.ride.hasPhoto || !window.cordova);
        }

    }

});