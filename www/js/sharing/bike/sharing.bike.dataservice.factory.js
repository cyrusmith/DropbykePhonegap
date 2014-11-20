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
            getBike: getBike
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
                        $q.reject("Failed to get bike info");
                    }
                }, function (resp) {
                    if (resp.data.error) {
                        return $q.reject(resp.data.error);
                    }
                    return $q.reject(resp.data.status);
                });
        }

    }

});
