define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('mybikesDataService', mybikesDataService);

    mybikesDataService.$inject = ['$q', '$http', '$log', 'authService', 'BACKEND_URL'];

    function mybikesDataService($q, $http, $log, authService, BACKEND_URL) {

        return {
            loadBikes: loadBikes
        }

        function loadBikes(lng1, lng2, lat1, lat2) {

            var deferred = $q.defer();

            var query = [];

            if (lng1 && lng2 && lat1 && lat2) {
                if (lng1 > lng2) {
                    var tmp = lng2;
                    lng2 = lng1;
                    lng1 = tmp;
                }
                query = ['lng1=' + lng1, 'lng2=' + lng2, 'lat1=' + lat1, 'lat2=' + lat2];
            }

            $http.get(BACKEND_URL + "/api/share/bikes?" + query.join('&'), {
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