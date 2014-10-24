define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('confirmService', confirmService);

    confirmService.$inject = ['$q'];

    function confirmService($q) {

        return {
            submitSMS: submitSMS,
            verifyCode: verifyCode
        }

        function submitSMS(phone) {

            var defer = $q.defer();

            setTimeout(function () {
                defer.resolve(true);
            }, 1000);

            return defer.promise;
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