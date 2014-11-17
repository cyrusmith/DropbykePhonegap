define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('confirmService', confirmService);

    confirmService.$inject = ['$q', '$http', '$log', '$localStorage', 'authService', 'BACKEND_URL'];

    function confirmService($q, $http, $log, $localStorage, authService, BACKEND_URL) {

        return {
            submitSMS: submitSMS,
            verifyCode: verifyCode
        }

        function submitSMS(phone) {

            var deferred = $q.defer();

            if (phone) {
                $localStorage.phone = phone;
            }
            else {
                phone = $localStorage.phone;
            }

            if (!phone) {
                d.reject('Phone number not set');
            }
            else {
                $http.post(BACKEND_URL + "/api/register", {
                    "phone": phone
                }).then(function success(resp) {
                        if (resp.data.request_key) {
                            $log.log("submitSMS success", resp);
                            $localStorage.phone_verification_key = resp.data.request_key;
                            deferred.resolve($localStorage.phone_verification_key);
                        }
                        else {
                            deferred.reject(resp.data.error ? resp.data.error : "Failed to send SMS");
                        }
                    }, function fail(resp) {
                        $log.log("submitSMS fail", resp);
                        deferred.reject(resp.data.error ? resp.data.error : "Failed to send SMS");
                    });
            }


            return deferred.promise;
        }

        function verifyCode(code) {

            var deferred = $q.defer(),
                apiPath = authService.isLoggedIn() ? "/api/verifyAuthenticated" : "/api/verify";

            var params = authService.isLoggedIn() ? {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            } : {};

            if (!$localStorage.phone_verification_key) {
                deferred.reject("Code expired. Resend SMS.");
            }
            else {

                $http.post(BACKEND_URL + apiPath, {
                    "code": code,
                    "phone": $localStorage.phone,
                    "verify_key": $localStorage.phone_verification_key
                }, params).then(function (resp) {
                        $localStorage.phone_verification_key = null;
                        if (!!resp.data.access_token) {
                            authService.setToken(resp.data.access_token);
                        }
                        $localStorage.phone = null;
                        deferred.resolve(resp.data.user_info);
                    },function (resp) {
                        alert(JSON.stringify(resp));
                        $log.log("verifyCode fail", resp);
                        deferred.reject(resp.data.error ? resp.data.error : "Failed to verify code");
                    }).finally(function () {

                    });
            }

            return deferred.promise;
        }

    }

});