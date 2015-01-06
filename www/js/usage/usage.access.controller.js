/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageAccessController', UsageAccessController);

    UsageAccessController.$inject = ['rideData', 'BACKEND_URL'];

    function UsageAccessController(rideData, BACKEND_URL) {

        var vm = this;

        vm.ride;
        vm.bike;
        vm.currentTimestamp;
        vm.markers;
        vm.location;
        vm.zoom;
        vm.photo;

        vm.call = call;

        init();

        function init() {
            vm.ride = rideData.ride;
            vm.bike = rideData.bike;

            vm.markers = [
                [vm.bike.lat, vm.bike.lng]
            ];
            vm.location = [vm.bike.lat, vm.bike.lng];
            vm.zoom = 16;

            vm.bike.rating = parseInt(rideData.bike.rating * 10) / 10;
            vm.currentTimestamp = rideData.timestamp;
            if (vm.bike.lastRideId) {
                vm.photo = BACKEND_URL + '/images/rides/' + vm.bike.lastRideId + '.jpg';
            }
            else {
                vm.photo = BACKEND_URL + '/images/bikes/' + vm.bike.id + '.jpg';
            }

        }

        function call() {
            if (vm.bike.lastUserPhone) {
                window.open('tel:' + vm.bike.lastUserPhone, '_system');
            }
        }

    }

});