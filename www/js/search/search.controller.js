define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('SearchController', SearchController);

    SearchController.$inject = ['bikes', 'GOOGLE_API_KEY', '$timeout', '$scope', 'geolocation'];

    function SearchController(bikes, GOOGLE_API_KEY, $timeout, $scope, geolocation) {

        var vm = this;

        vm.apiKey = GOOGLE_API_KEY;
        vm.currentLocation = [55.168135, 61.388860];
        vm.markers = [];

        vm.zoom = 16;

        function init() {
            for (var i = 0; i < bikes.length; i++) {
                vm.markers.push([bikes[i].lat, bikes[i].lng]);
            }
        }

        geolocation.getLocation({})
            .then(function (pos) {
                vm.currentLocation = [pos.coords.latitude, pos.coords.longitude];
            }, function (error) {
                $ionicPopup.show({
                    title: error,
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
            })
            .finally(function () {
                init();
            });

    }

});