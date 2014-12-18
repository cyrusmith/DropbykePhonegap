/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageMapController', UsageMapController);

    UsageMapController.$inject = ['rideData', '$localStorage', '$ionicLoading', 'mapDataService', '$state'];

    function UsageMapController(rideData, $localStorage, $ionicLoading, mapDataService, $state) {

        var vm = this;
        vm.ride = null;
        vm.currentLocation = null;
        vm.markers = null;
        vm.bounds = null;
        vm.currentTimestamp = rideData.timestamp;
        vm.zoom = 15;
        vm.path;
        vm.locationError;

        vm.getCurrentLocation = getCurrentLocation;

        init();

        function init() {

            $localStorage.dropBikePageHolder = null;

            vm.ride = rideData.ride;

            if (!vm.ride) {
                $state.go('app.search');
                return;
            }

            vm.markers = [
                [vm.ride.startLat, vm.ride.startLng]
            ];

            getCurrentLocation();

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

        function getCurrentLocation() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your location...'
            });
            mapDataService.getLocation()
                .then(function (pos) {

                    vm.locationError = null;

                    vm.currentLocation = [pos.latitude, pos.longitude];

                    vm.path = [
                        [vm.ride.startLat, vm.ride.startLng],
                        vm.currentLocation
                    ];

                    updateBounds();

                },function (error) {
                    vm.locationError = error.message;
                    vm.currentLocation = null;
                    vm.path = null;
                }).finally(function () {
                    $ionicLoading.hide();
                });


        }

    }

});