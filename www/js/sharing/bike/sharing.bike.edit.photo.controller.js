define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikePhotoCtrl', SharingBikePhotoCtrl);

    SharingBikePhotoCtrl.$inject = [];

    function SharingBikePhotoCtrl() {
        var vm = this;

        init();

        function init() {
            console.log('SharingBikePhotoCtrl');
        }

    }

});