define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').factory('authService', authService);

    authService.$inject = ['$http', '$localStorage', 'BACKEND_URL'];

    function authService($http, $localStorage, BACKEND_URL) {

        return {
            isLoggedIn: isLoggedIn,
            setToken: setToken,
            getToken: getToken,
            isPhoneConfirmed: isPhoneConfirmed,
            setPhoneConfirmed: setPhoneConfirmed,
            logout: logout
        }

        function isLoggedIn() {
            return !!$localStorage.auth_token;
        }

        function setPhoneConfirmed(isPhoneConfirmed) {
            $localStorage.isPhoneConfirmed = isPhoneConfirmed;
        }

        function isPhoneConfirmed() {
            return !!$localStorage.isPhoneConfirmed;
        }

        function setToken(token) {
            $localStorage.auth_token = token;
        }

        function getToken() {
            return $localStorage.auth_token;
        }

        function logout() {
            return $http.post(BACKEND_URL + '/api/profile/logout', {}, {
                headers: {
                    "Authorization": "Bearer " + getToken()
                }
            });
        }

    }

});