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

        console.log("rideData", rideData);

        var vm = this;

        vm.ride = rideData.ride;
        vm.bike = rideData.bike;
        vm.bike.rating = parseInt(rideData.bike.rating*10)/10;
        vm.currentTimestamp = rideData.timestamp;

        vm.ride.photo = BACKEND_URL + '/images/rides/' + vm.bike.lastRideId + '.jpg';
    }

});