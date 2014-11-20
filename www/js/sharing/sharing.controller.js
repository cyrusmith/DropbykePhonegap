define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingCtrl', SharingCtrl);

    SharingCtrl.$inject = ['$scope', 'appstate'];

    function SharingCtrl($scope, appstate) {
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