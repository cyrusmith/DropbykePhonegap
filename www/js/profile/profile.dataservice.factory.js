/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('profileDataService', profileDataService);

    profileDataService.$inject = ['$q', '$http', '$log', 'authService', 'BACKEND_URL'];

    function profileDataService($q, $http, $log, authService, BACKEND_URL) {

        return {
            getProfile: getProfile
        };

        function getProfile() {
            return $http.get(BACKEND_URL + '/api/profile', {

                    headers: {
                        "Authorization": "Bearer " + authService.getToken()
                    }
                }
            ).then(function success(resp) {
                    $log.log("getProfile success", resp);
                    return resp.data.profile;
                }, function fail(resp) {
                    $log.log("getProfile fail", resp);
                    $q.reject(resp);
                });
        }

    }

});
