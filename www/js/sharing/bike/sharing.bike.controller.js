define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeCtrl', SharingBikeCtrl);

    SharingBikeCtrl.$inject = ['$log'];

    function SharingBikeCtrl($log) {

        var vm = this;

        init();

        function init() {
            $log.log('SharingBikeCtrl');
        }

    }

});