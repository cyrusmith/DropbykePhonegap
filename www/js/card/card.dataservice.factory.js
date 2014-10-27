define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.card').factory('cardService', cardService);

    cardService.$inject = ['$q', '$http', '$log', 'authService', 'BACKEND_URL'];

    function cardService($q, $http, $log, authService, BACKEND_URL) {

        return {
            addCard: addCard
        }

        function addCard(number, name, expire, cvc) {

            var deferred = $q.defer();

            $http.post(BACKEND_URL + "/api/addcard", {
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