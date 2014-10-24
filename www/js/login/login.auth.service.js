define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').controller('authService', authService);

    authService.$inject = ['$localStorage'];

    function authService($localStorage) {

        return {
            isLoggedIn: isLoggedIn
        }

        function isLoggedIn() {
            return !!$localStorage.auth_token;
        }

    }

});