define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike').controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope', '$rootScope', '$state', '$localStorage', 'appstate', 'authService'];

    function AppCtrl($scope, $rootScope, $state, $localStorage, appstate, authService) {
        var vm = this;

        vm.sharingToggle;
        vm.changeSharingToggle = changeSharingToggle;

        init();
        changeSharingToggle();

        function init() {

            vm.sharingToggle = appstate.getMode() == 'share';

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                if (["app.start", "app.phoneconfirm", "app.phoneverifycode", "app.offline", "app.payments", "app.editcard"].indexOf(toState.name) === -1) {

                    if (!authService.isLoggedIn()) {
                        event.preventDefault();
                        $state.go('app.start');
                    }
                    else if (!authService.isPhoneConfirmed()) {
                        event.preventDefault();
                        $state.go('app.phoneconfirm');
                    } else if (!authService.isHasPayment()) {
                        event.preventDefault();
                        $state.go('app.editcard');
                    }
                }
                return true;
            });

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.name != "app.offline") {
                        $localStorage.previousState = {
                            "name": toState.name,
                            "params": toParams
                        };
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