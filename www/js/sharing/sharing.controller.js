define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingCtrl', SharingCtrl);

    SharingCtrl.$inject = ['$scope', '$state', 'appstate'];

    function SharingCtrl($scope, $state, appstate) {
        var vm = this;

        vm.sharingToggle;

        vm.changeSharingToggle = changeSharingToggle;

        init();

        function init() {
            vm.sharingToggle = appstate.getMode() == 'share';
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