define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileViewController', ProfileViewController);
    ProfileViewController.$inject = ['profile', '$ionicPopup', '$ionicLoading', '$localStorage', '$log', '$state', 'confirmService'];
    function ProfileViewController(profile, $ionicPopup, $ionicLoading, $localStorage, $log, $state, confirmService) {

        var vm = this;

        vm.profile = {
            email: 'vasya@mail.ru',
            phone: '11233455667',
            name: 'Alexander Sutyagin'
        };


    }

});