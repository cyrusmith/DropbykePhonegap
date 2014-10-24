define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('confirmService', confirmService);

    confirmService.$inject = ['$q', '$http', '$log', 'BACKEND_URL'];

    function confirmService($q, $http, $log, BACKEND_URL) {

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

        function verifyCode(code) {

            var defer = $q.defer();

            setTimeout(function () {
                if (code == "000000") {
                    defer.resolve(true);
                }
                else {
                    defer.reject(true);
                }

            }, 1000);

            return defer.promise;
        }

    }

});