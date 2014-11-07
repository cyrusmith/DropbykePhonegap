/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */

define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike').service('ConnectivityService', ConnectivityService);

    ConnectivityService.$inject = ['$state'];

    function ConnectivityService($state) {

        this.start = start;
        this.stop = stop;

        function start() {
            document.addEventListener("offline", onOffline, false);
        }

        function stop() {
            document.removeEventListener("offline", onOffline, false);
        }

        function onOffline() {
            $state.go('app.offline');
        }

    }

});