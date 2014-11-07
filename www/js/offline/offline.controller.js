define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.offline').controller('OfflineController', OfflineController);
    OfflineController.$inject = ['$state', '$localStorage'];

    function OfflineController($state, $localStorage) {

        var vm = this;

        vm.retry = retry;

        function retry() {
            if ($localStorage.previousState) {
                $state.go($localStorage.previousState.name, $localStorage.previousState.params);
            }
            else {
                $state.go("app.search");
            }

        }

    }

});