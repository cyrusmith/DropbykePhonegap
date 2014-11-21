define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.mybikes').controller('SharingMyBikesCtrl', SharingMyBikesCtrl);

    SharingMyBikesCtrl.$inject = ['$log'];

    function SharingMyBikesCtrl($log) {

        var vm = this;

        init();

        function init() {
            $log.log('SharingMyBikesCtrl');
        }

    }

});