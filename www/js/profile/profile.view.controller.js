define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileViewController', ProfileViewController);
    ProfileViewController.$inject = ['profile', 'BACKEND_URL', 'authService', '$state'];
    function ProfileViewController(profile, BACKEND_URL, authService, $state) {

        var vm = this;

        vm.profile = profile.user;
        vm.logout = logout;
        vm.profile.photo = BACKEND_URL + '/images/users/' + vm.profile.id + '.jpg?nocache' + (new Date()).getTime();

        function logout() {
            authService.setToken(null);
            $state.go('app.start');
        }

    }

});