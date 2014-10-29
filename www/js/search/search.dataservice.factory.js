define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('searchDataService', searchDataService);

    searchDataService.$inject = ['$q', '$http', '$log', 'authService', 'BACKEND_URL'];

    function searchDataService($q, $http, $log, authService, BACKEND_URL) {

        return {
            loadBikes: loadBikes
        }

        function loadBikes() {

            var deferred = $q.defer();

            $http.get(BACKEND_URL + "/bikes", {
                    headers: {
                        "Authorization": "Bearer " + authService.getToken()
                    }
                }
            ).then(function success(resp) {
                    $log.log("loadBikes success", resp);
                    deferred.resolve(resp.data.bikes);
                }, function fail(resp) {
                    $log.log("loadBikes fail", resp);
                    deferred.reject(resp);
                });

            return deferred.promise;
        }

    }

})
;