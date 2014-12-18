define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingCtrl', SharingCtrl);

    SharingCtrl.$inject = ['$scope', '$state', 'appstate', 'bikeEditFormDataService', '$rootScope'];

    function SharingCtrl($scope, $state, appstate, bikeEditFormDataService, $rootScope) {
        var vm = this;

        vm.sharingToggle;

        vm.changeSharingToggle = changeSharingToggle;

        init();

        function init() {
            vm.sharingToggle = true;

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.name.indexOf("sharing.bike.edit") == -1) {
                        console.log("RESET EDIT");
                        bikeEditFormDataService.set(null);
                    }
                });

        }

        function changeSharingToggle() {
            console.log(vm.sharingToggle);
            if (vm.sharingToggle === true) {
                appstate.setMode('share');
                $state.go('sharing.mybikes');
            }
            else {
                appstate.setMode('default');
                $state.go('app.search');
            }

        }

    }

});