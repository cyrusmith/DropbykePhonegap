/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module("dropbike.usage").controller('UsageAccessController', UsageAccessController);

    UsageAccessController.$inject = ['$localStorage', '$state', 'BACKEND_URL'];

    function UsageAccessController($localStorage, $state, BACKEND_URL) {

        var vm = this;

        if (!$localStorage.ride) {
            $state.go('app.search');
            return;
        }

        vm.ride = $localStorage.ride;
        vm.ride.photo = BACKEND_URL + '/images/rides/' + vm.ride.lastRideId + '.jpg';
    }

});