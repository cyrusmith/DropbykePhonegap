define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeLocationCtrl', SharingBikeLocationCtrl);

    SharingBikeLocationCtrl.$inject = [];

    function SharingBikeLocationCtrl() {
        var vm = this;

        init();

        function init() {
            console.log('SharingBikeLocationCtrl');
        }

    }

});