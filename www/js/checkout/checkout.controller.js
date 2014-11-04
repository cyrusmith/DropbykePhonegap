/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike.bike").controller("CheckoutController", CheckoutController);

    CheckoutController.$inject = ['rideData', 'usageDataService', '$localStorage', '$stateParams', '$ionicPopup', '$state', 'BACKEND_URL'];

    function CheckoutController(rideData, usageDataService, $localStorage, $stateParams, $ionicPopup, $state, BACKEND_URL) {

        var vm = this;
        vm.photo = BACKEND_URL + '/images/rides/' + rideData.ride.id + '.jpg';
        vm.rating = 0;
        vm.bike = rideData.bike;
        vm.ride = rideData.ride;

        console.log("CheckoutController", rideData);

    }

});