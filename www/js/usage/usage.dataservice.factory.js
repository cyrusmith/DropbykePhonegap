/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use scrict';

    angular.module('dropbike.usage').factory('usageDataService', usageDataService);

    usageDataService.$inject = ['authService', '$http', 'BACKEND_URL', '$log'];

    function usageDataService(authService, $http, BACKEND_URL, $log) {
        return {
            startUsage: startUsage
        }

        function startUsage(bikeId) {
            return $http.get(BACKEND_URL + '/api/bikes/startusage/' + bikeId, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                    $log.log("Bike loaded", response);
                    return response.data.bike;
                }, function (error) {
                    $log.error("Error getting bike", error);
                    return null;
                });
        }
    }

});
