define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').factory('authService', authService);

    authService.$inject = ['$q', '$localStorage', '$state', 'UserModel'];

    function authService($q, $localStorage, $state, UserModel) {

        return {
            isLoggedIn: isLoggedIn,
            setToken: setToken,
            getToken: getToken,
            redirectIf: redirectIf
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

        function redirectIf() {
            var defer = $q.defer();
            setTimeout(function () {
                var user = new UserModel();
                user.load();
                if (!user.isPhoneConfirmed) {
                    $state.go('app.phoneconfirm');
                    defer.reject(null);
                }
                else if(!user.isCardConfirmed) {
                    $state.go('app.addcard');
                    defer.reject(null);
                }
                else {
                    defer.resolve(user);
                }

            }, 1);
            return defer.promise;
        }

    }

});