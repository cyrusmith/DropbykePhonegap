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

    usageDataService.$inject = ['$q', 'authService', '$http', 'BACKEND_URL', '$log'];

    function usageDataService($q, authService, $http, BACKEND_URL, $log) {
        return {
            startUsage: startUsage,
            drop: drop
        }

        function startUsage(bikeId, userLat, userLng) {
            return $http.post(BACKEND_URL + '/api/bikes/startusage/', {
                bikeId: +bikeId,
                userLat: userLat,
                userLng: userLng
            }, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                $log.log("Ride started", response);
                return response.data.ride;
            }, function (resp) {
                $log.error("Error start usage");
                return $q.reject(resp.data.error ? resp.data.error : "Error start usage");
            });
        }

        function drop(lat, lng, address, lockPassword, message, distance) {
            return $http.post(BACKEND_URL + '/api/rides/stop/', {
                lat: lat, lng: lng, address: address, lockPassword: lockPassword, message: message, distance: distance
            }, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (response) {
                $log.log("Ride stopped", response);
                return response.data;
            }, function (resp) {
                $log.error("Error stoppint usage");
                return $q.reject(resp.data.error ? resp.data.error : "Error stop usage");
            });
        }

    }

});
