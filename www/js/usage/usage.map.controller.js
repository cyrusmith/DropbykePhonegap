/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageMapController', UsageMapController);

    UsageMapController.$inject = ['$localStorage', 'geolocation', '$state', 'BACKEND_URL'];

    function UsageMapController($localStorage, geolocation, $state, BACKEND_URL) {

        var vm = this;
        vm.ride = null;
        vm.currentLocation = null;
        vm.markers = null;
        vm.bounds = null;
        vm.zoom = 15;

        init();

        function init() {

            vm.ride = $localStorage.ride;

            if (!$localStorage.ride) {
                $state.go('app.search');
                return;
            }

            vm.markers = [
                [$localStorage.ride.startLat, $localStorage.ride.startLng]
            ];

            geolocation.getLocation({})
                .then(function (pos) {
                    vm.currentLocation = [pos.coords.latitude, pos.coords.longitude];
                    updateBounds();
                }, function (error) {
                });
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