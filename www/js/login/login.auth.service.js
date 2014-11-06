define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').factory('authService', authService);

    authService.$inject = ['$q', '$localStorage', '$state'];

    function authService($q, $localStorage, $state) {

        return {
            isLoggedIn: isLoggedIn,
            setToken: setToken,
            getToken: getToken
        }

        function isLoggedIn() {
            return !!$localStorage.auth_token;
        }

        function setToken(token) {
            $localStorage.auth_token = token;
        }

        function getToken() {
            return $localStorage.auth_token;
        }

    }

});