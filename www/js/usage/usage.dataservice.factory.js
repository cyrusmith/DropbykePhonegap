/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.usage').factory('usageDataService', usageDataService);

    usageDataService.$inject = ['authService', '$http', 'BACKEND_URL', '$log'];

    function usageDataService(authService, $http, BACKEND_URL, $log) {
        return {
            startUsage: startUsage
        }

        function startUsage(bikeId) {
            return $http.post(BACKEND_URL + '/api/bikes/startusage/', {
                bikeId: +bikeId
            }, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                    $log.log("Ride started", response);
                    return response.data.ride;
                }, function (error) {
                    $log.error("Error starting ride", error);
                    return null;
                });
        }
    }

});
