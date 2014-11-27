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

        function loadBikes(lng1, lng2, lat1, lat2, userLat, userLng) {

            var deferred = $q.defer();

            var query = [];

            if (lng1 && lng2 && lat1 && lat2) {
                if (lng1 > lng2) {
                    var tmp = lng2;
                    lng2 = lng1;
                    lng1 = tmp;
                }
                query = ['lng1=' + lng1, 'lng2=' + lng2, 'lat1=' + lat1, 'lat2=' + lat2, 'userLat=' + userLat, 'userLng=' + userLng];
            }


            $http.get(BACKEND_URL + "/api/bikes?" + query.join('&'), {
                    headers: {
                        "Authorization": "Bearer " + authService.getToken()
                    }
                }
            ).then(function success(resp) {
                    $log.log("loadBikes success", resp);
                    deferred.resolve(resp.data);
                }, function fail(resp) {
                    $log.log("loadBikes fail", resp);
                    deferred.reject(resp);
                });

            return deferred.promise;
        }

    }

})
;