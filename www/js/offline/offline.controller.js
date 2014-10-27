define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.offline').controller('OfflineController', OfflineController);
    OfflineController.$inject = ['$state'];

    function OfflineController($state) {
        //TODO

        var vm = this;

        vm.retry = retry;

        function retry() {
            $state.go('app.start');
        }

    }

});