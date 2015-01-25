define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeCtrl', SharingBikeCtrl);

    SharingBikeCtrl.$inject = ['bikeEditFormDataService', '$state', 'appstate'];

    function SharingBikeCtrl(bikeEditFormDataService, $state, appstate) {

        var vm = this;

        init();

        function init() {

            if (appstate.getMode() !== 'share') {
                $state.go('app.search');
                return;
            }

            bikeEditFormDataService.set(null);
        }

    }

});