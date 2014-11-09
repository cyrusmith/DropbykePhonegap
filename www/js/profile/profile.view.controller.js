define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileViewController', ProfileViewController);
    ProfileViewController.$inject = ['profile', 'BACKEND_URL', 'authService', '$state', '$localStorage'];
    function ProfileViewController(profile, BACKEND_URL, authService, $state, $localStorage) {

        var vm = this;

        vm.profile = profile.user;
        vm.profile.photo = BACKEND_URL + '/images/users/' + vm.profile.id + '.jpg?nocache' + (new Date()).getTime();

        vm.logout = logout;

        if ($localStorage.facebook) {
            if ($localStorage.facebook.email) {
                vm.profile.email = $localStorage.facebook.email;
            }
            if ($localStorage.facebook.name) {
                vm.profile.name = $localStorage.facebook.name;
            }
            if ($localStorage.facebook.image) {
                vm.profile.photo = $localStorage.facebook.image;
            }
        }

        function logout() {
            authService.logout()
                .then(function () {
                    authService.setToken(null);
                    $localStorage.facebook = null;
                    $state.go('app.start');
                });
        }

    }

});