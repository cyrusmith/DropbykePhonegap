define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeCtrl', SharingBikeCtrl);

    SharingBikeCtrl.$inject = ['bikeEditFormDataService'];

    function SharingBikeCtrl(bikeEditFormDataService) {

        var vm = this;

        init();

        function init() {
            bikeEditFormDataService.set(null);
        }

    }

});