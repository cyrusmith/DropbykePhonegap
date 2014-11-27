/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.history').controller('SharingHistoryItemCtrl', SharingHistoryItemCtrl);

    SharingHistoryItemCtrl.$inject = ['item'];

    function SharingHistoryItemCtrl(item) {

        var vm = this;

        vm.item;

        init();

        function init() {
            vm.item = angular.extend({}, item);
            vm.item.sum = vm.item.sum / 100;

            var startDate = new Date();
            startDate.setTime(vm.item.startTime * 1000);

            vm.item.startTime = startDate;

            var stopDate = new Date();
            stopDate.setTime(vm.item.stopTime * 1000);

            vm.item.stopTime = stopDate;
        }

        console.log("item", item);

    }

});
