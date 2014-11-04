define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('confirmService', confirmService);

    confirmService.$inject = ['$q', '$http', '$log', 'authService', 'BACKEND_URL'];

    function confirmService($q, $http, $log, authService, BACKEND_URL) {

        return {
            submitSMS: submitSMS,
            verifyCode: verifyCode
        }

        function submitSMS(phone) {

            var deferred = $q.defer();

            $http.post(BACKEND_URL + "/api/register", {
                "phone": phone
            }).then(function success(resp) {
                    $log.log("submitSMS success", resp);
                    deferred.resolve(resp);
                }, function fail(resp) {
                    $log.log("submitSMS fail", resp);
                    deferred.reject(resp);
                });

            return deferred.promise;
        }

        function verifyCode(code, key) {

            var deferred = $q.defer();

            $http.post(BACKEND_URL + "/api/verify", {
                "code": code,
                "verify_key": key
            }).then(function success(resp) {
                    $log.log("verifyCode success", resp);
                    if(!!resp.data.access_token) {
                        authService.setToken(resp.data.access_token);
                        deferred.resolve(resp.data.user_info);
                    }
                    else {
                        reject(resp);
                    }
                }, function fail(resp) {
                    $log.log("verifyCode fail", resp);
                    deferred.reject(resp);
                });

            return deferred.promise;
        }

    }

});