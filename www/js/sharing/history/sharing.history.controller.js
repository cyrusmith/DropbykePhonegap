/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.history').controller('SharingHistoryCtrl', SharingHistoryCtrl);

    SharingHistoryCtrl.$inject = ['$state', 'appstate'];

    function SharingHistoryCtrl($state, appstate) {

        init();

        function init() {

            if (appstate.getMode() !== 'share') {
                $state.go('app.search');
                return;
            }
        }

    }

});
