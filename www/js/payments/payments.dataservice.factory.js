define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.payments').factory('paymentsDataService', paymentsDataService);

    paymentsDataService.$inject = ['$q', '$http', 'authService', '$log', 'BACKEND_URL'];

    function paymentsDataService($q, $http, authService, $log, BACKEND_URL) {

        return {
            editCard: editCard
        }

        function editCard(number, name, expire, cvc) {

            var deferred = $q.defer();

            $http.post(BACKEND_URL + "/api/aditcard", {
                number: number,
                name: name,
                expire: expire,
                cvc: cvc
            }, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function success(resp) {
                    $log.log("addCard success", resp);
                    deferred.resolve(resp);
                }, function fail(resp) {
                    $log.log("addCard fail", resp);
                    deferred.reject(resp);
                });

            return deferred.promise;
        }

    }

});