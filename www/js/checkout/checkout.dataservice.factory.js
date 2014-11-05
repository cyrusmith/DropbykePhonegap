/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use scrict';

    angular.module('dropbike.bike').factory('checkoutDataService', checkoutDataService);

    checkoutDataService.$inject = ['authService', '$http', 'BACKEND_URL', '$log'];

    function checkoutDataService(authService, $http, BACKEND_URL, $log) {
        return {
            checkout: checkout,
            loadRideData: loadRideData
        }

        function loadRideData(rideId) {
            return $http.get(BACKEND_URL + '/api/rides/' + rideId, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                    $log.log("Ride loaded", response);
                    return response.data;
                }, function (error) {
                    $log.error("Error getting Ride", error);
                    return null;
                });
        }

        function checkout(rideId, rating) {
            return $http.post(BACKEND_URL + '/api/rides/checkout', {
                rideId: rideId,
                rating: rating
            }, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                    $log.log("Checkout complete", response);
                    return response.data;
                }, function (error) {
                    $log.error("Checkout error", error);
                    return null;
                });
        }
    }

});
