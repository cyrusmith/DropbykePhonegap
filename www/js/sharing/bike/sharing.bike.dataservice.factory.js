/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('map').factory('sharingBikeDataService', sharingBikeDataService);

    sharingBikeDataService.$inject = ['$q', '$http', 'authService', 'BACKEND_URL'];

    function sharingBikeDataService($q, $http, authService, BACKEND_URL) {

        return {
            getBike: getBike,
            saveBike: saveBike
        }

        function getBike(bikeId) {
            if (!bikeId) {
                return $q.reject("Bike is not set");
            }
            return $http.get(BACKEND_URL + '/api/share/bike/' + bikeId, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            })
                .then(function (resp) {
                    if (resp.data.bike) {
                        return resp.data.bike
                    }
                    else if (resp.data.error) {
                        return $q.reject(resp.data.error);
                    }
                    else {
                        $q.reject("Failed to get bike");
                    }
                }, function (resp) {
                    if (resp.data.error) {
                        return $q.reject(resp.data.error);
                    }
                    return $q.reject("Failed to get bike");
                });
        }

        function saveBike(bike) {

            if (!(bike.address && bike.lat && bike.lng)) {
                return $q.reject("Please set address and coords");
            }

            if (!(bike.sku && bike.name)) {
                return $q.reject("Please set serial and bike name");
            }

            if (!(bike.price && bike.lockPassword && bike.message)) {
                return $q.reject("Please set price per hour, lock password and message to the next user");
            }

            return $http({
                url: BACKEND_URL + '/api/share/bike/',
                method: bike.id ? 'PUT' : 'POST',
                data: bike,
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (resp) {
                    if (resp.data.bike) {
                        return resp.data.bike
                    }
                    else if (resp.data.error) {
                        return $q.reject(resp.data.error);
                    }
                    else {
                        $q.reject("Failed to save bike info");
                    }
                }, function (resp) {
                    if (resp.data.error) {
                        return $q.reject(resp.data.error);
                    }
                    return $q.reject("Failed to save bike info");
                });
        }

    }

});
