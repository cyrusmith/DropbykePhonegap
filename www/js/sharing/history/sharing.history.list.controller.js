/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.history').controller('SharingHistoryListCtrl', SharingHistoryListCtrl);

    SharingHistoryListCtrl.$inject = ['items', '$state', 'appstate'];

    function SharingHistoryListCtrl(items, $state, appstate) {
        var vm = this;

        vm.items;

        init();

        function init() {

            if (appstate.getMode() !== 'share') {
                $state.go('app.search');
                return;
            }

            vm.items = items;
        }
    }

});
