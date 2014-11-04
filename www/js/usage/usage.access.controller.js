/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageAccessController', UsageAccessController);

    UsageAccessController.$inject = ['rideData', '$state', 'BACKEND_URL'];

    function UsageAccessController(rideData, $state, BACKEND_URL) {

        var vm = this;

        vm.ride = rideData.ride;
        vm.bike = rideData.bike;
        vm.ride.photo = BACKEND_URL + '/images/rides/' + vm.ride.lastRideId + '.jpg';
    }

});