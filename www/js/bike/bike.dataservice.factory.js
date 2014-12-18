/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use scrict';

    angular.module('dropbike.bike').factory('bikeDataService', bikeDataService);

    bikeDataService.$inject = ['authService', '$q', '$http', 'BACKEND_URL', '$log'];

    function bikeDataService(authService, $q, $http, BACKEND_URL, $log) {
        return {
            getBike: getBike,
            isValidDistance: isValidDistance
        }

        function getBike(id) {
            return $http.get(BACKEND_URL + '/api/bikes/' + id, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                $log.log("Bike loaded", response);
                return response.data;
            }, function (error) {
                $log.error("Error getting bike", error);
                return null;
            });
        }

        function isValidDistance(bikeId, lat, lng) {
            return $http.get(BACKEND_URL + '/api/bikes/distancevalid?bikeId=' + bikeId + '&lat=' + lat + '&lng=' + lng, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                $log.log("Bike loaded", response);
                return response.data.isValidDistance;
            }, function (error) {
                return $q.reject(error.data.error ? error.data.error : "Error getting distance to bike");
            });
        }
    }

});
