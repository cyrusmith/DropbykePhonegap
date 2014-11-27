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

    SharingHistoryListCtrl.$inject = ['items'];

    function SharingHistoryListCtrl(items) {
        var vm = this;

        vm.items;

        init();

        function init() {
            vm.items = items;
        }
    }

});
