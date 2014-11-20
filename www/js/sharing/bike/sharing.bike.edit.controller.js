define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeEditCtrl', SharingBikeEditCtrl);

    SharingBikeEditCtrl.$inject = ['bike', '$log'];

    function SharingBikeEditCtrl(bike, $log) {
        var vm = this;

        vm.bike;

        init();

        function init() {
            vm.bike = bike;
            $log.log('SharingBikeEditCtrl', bike);
        }


    }

});