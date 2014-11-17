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

    profileDataService.$inject = ['$q', '$http', '$log', 'authService', 'cameraUtil', 'BACKEND_URL'];

    function profileDataService($q, $http, $log, authService, cameraUtil, BACKEND_URL) {

        return {
            getProfile: getProfile,
            updateProfile: updateProfile,
            updatePhoto: updatePhoto
        };

        function getProfile() {
            return $http.get(BACKEND_URL + '/api/profile', {

                    headers: {
                        "Authorization": "Bearer " + authService.getToken()
                    }
                }
            ).then(function success(resp) {
                    $log.log("getProfile success", resp);
                    if (resp.data.user) {
                        if (resp.data.user.phone) {
                            authService.setPhoneConfirmed(true);
                        }
                        else {
                            authService.setPhoneConfirmed(false);
                        }

                        if (resp.data.user.cards && resp.data.user.cards.length) {
                            authService.setHasPayment(true);
                        }
                        else {
                            authService.setHasPayment(false);
                        }
                    }
                    return resp.data;
                }, function fail(resp) {
                    $log.log("getProfile fail", resp);
                    return $q.reject(resp);
                });
        }

        function updateProfile(name, email, shareFacebook) {
            return $http.post(BACKEND_URL + '/api/profile', {
                    name: name,
                    email: email,
                    shareFacebook: !!shareFacebook
                }, {
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

        function updatePhoto(src) {
            return cameraUtil.pickAndUpload(src, BACKEND_URL + "/api/profile/photo");
        }

    }

});
