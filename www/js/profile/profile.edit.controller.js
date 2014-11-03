define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileEditController', ProfileEditController);
    ProfileEditController.$inject = ['profile', '$ionicPopup', '$ionicLoading', '$localStorage', '$log', '$state', 'confirmService'];
    function ProfileEditController(profile, $ionicPopup, $ionicLoading, $localStorage, $log, $state, confirmService) {

        var vm = this;

        vm.profile = profile;

    }

});