define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.login').factory('authRedirectService', authRedirectService);

    authRedirectService.$inject = ['$q', '$localStorage', '$state', 'UserModel'];

    function authRedirectService($q, $localStorage, $state, UserModel) {

        var defer = $q.defer();
        setTimeout(function () {
            var user = new UserModel();
            user.load();
            if (!user.isPhoneConfirmed) {
                $state.go('app.phoneconfirm');
                defer.reject(null);
            }
            else if (!user.isCardConfirmed) {
                $state.go('app.addcard');
                defer.reject(null);
            }
            else {
                defer.resolve(user);
            }

        }, 1);
        return defer.promise;

    }

});