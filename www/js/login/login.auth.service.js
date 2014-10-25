define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').factory('authService', authService);

    authService.$inject = ['$localStorage'];

    function authService($localStorage) {

        return {
            isLoggedIn: isLoggedIn,
            setToken: setToken
        }

        function isLoggedIn() {
            return !!$localStorage.auth_token;
        }

        function setToken(token) {
            return $localStorage.auth_token = token;
        }

    }

});