define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike').controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope', 'appstate'];

    function AppCtrl($scope, appstate) {
        var vm = this;

        vm.isSharingMode;

        init();

        function init() {
            vm.isSharingMode = appstate.getMode() == 'share';

            $scope.$watch('vm.isSharingMode', function (value) {
                if (value === true) {
                    appstate.setMode('share');
                }
                else {
                    appstate.setMode('default');
                }
            });
        }

    }

});