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

    bikeDataService.$inject = ['authService', '$http', 'BACKEND_URL', '$log'];

    function bikeDataService(authService, $http, BACKEND_URL, $log) {
        return {
            getBike: getBike
        }

        function getBike(id) {
            return $http.get(BACKEND_URL + '/api/bikes/' + id, {
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
