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

        function logout() {
            authService.logout()
                .then(function () {
                    $state.go('app.start');
                });
        }

    }

});