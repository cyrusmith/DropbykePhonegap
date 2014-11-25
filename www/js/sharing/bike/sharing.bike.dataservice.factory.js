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

    sharingBikeDataService.$inject = ['$q', '$http', 'authService', 'uploadUtil', 'BACKEND_URL'];

    function sharingBikeDataService($q, $http, authService, uploadUtil, BACKEND_URL) {

        return {
            getBike: getBike,
            saveBike: saveBike,
            isValid: isValid
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

        function isValid(b) {
            return b.hasOwnProperty('active') && b.title && b.sku && b.priceRate && b.lockPassword && b.lat && b.lng && b.address && b.messageFromLastUser;
        }

        function saveBike(bike, fileUri) {

            if (!isValid(bike)) {
                return $q.reject("Please set all fields correctly");
            }

            var url = BACKEND_URL + '/api/share/bikes/';

            if (fileUri) {
                var d = $q.defer();
                uploadUtil.upload(url, fileUri, "photo", "image/jpeg", bike, {
                    "Authorization": "Bearer " + authService.getToken()
                })
                    .then(function () {
                        d.resolve();
                    }, function (error) {
                        d.reject(error);
                    })
                return d.promise;
            }
            else {
                return $http({
                    url: url,
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

    }

});
