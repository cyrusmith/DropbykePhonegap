define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileViewController', ProfileViewController);
    ProfileViewController.$inject = ['profile', 'BACKEND_URL', '$ionicPopup', '$ionicLoading', '$localStorage', '$log', '$state', 'confirmService'];
    function ProfileViewController(profile, BACKEND_URL, $ionicPopup, $ionicLoading, $localStorage, $log, $state, confirmService) {

        var vm = this;

        vm.profile = profile;
        vm.profile.photo = BACKEND_URL + '/images/users/' + vm.profile.id + '.jpg?nocache' + (new Date()).getTime();

    }

});