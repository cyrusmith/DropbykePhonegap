/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.history').controller('SharingHistoryItemMapCtrl', SharingHistoryItemMapCtrl);

    SharingHistoryItemMapCtrl.$inject = ['item', 'type'];

    function SharingHistoryItemMapCtrl(item, type) {

        var vm = this;
        vm.address;
        vm.lat;
        vm.lng;
        vm.time;
        vm.type;

        init();

        function init() {

            if (type == 'start') {
                vm.type = 'Start';
                vm.address = item.startAddress;
                vm.lat = item.startLat;
                vm.lng = item.startLng;
                var time = new Date();
                time.setTime(item.startTime);
                vm.time = time;
            }
            else {
                vm.type = 'Stop';
                vm.address = item.stopAddress;
                vm.lat = item.stopLat;
                vm.lng = item.stopLng;
                var time = new Date();
                time.setTime(item.stopTime);
                vm.time = time;
            }

            vm.location = [vm.lat, vm.lng];

        }

    }

});
