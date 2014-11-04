define([
    "angular"
], function (angular) {

    'use strict';

    angular.module("dropbike").factory('connectionErrorInterceptor', connectionErrorInterceptor);

    connectionErrorInterceptor.$inject = ['$log', '$q', '$injector'];

    function connectionErrorInterceptor($log, $q, $injector) {

        return {
            responseError: responseError
        };

        function responseError(response) {
            $log.log("responseError", response);
            if(response.status == 401) {
                $injector.get('$state').go('app.start');
            }
            else if (response.status == 0) {
                $injector.get('$state').go('app.offline');
            }

            return $q.reject(response);
        }
    }

});