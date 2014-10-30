define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('SearchController', SearchController);

    SearchController.$inject = ['bikes', 'GOOGLE_API_KEY', 'geolocation', 'searchDataService', '$timeout', '$state', '$scope', '$localStorage'];

    function SearchController(bikes, GOOGLE_API_KEY, geolocation, searchDataService, $timeout, $state, $scope, $localStorage) {

        var vm = this;

        vm.apiKey = GOOGLE_API_KEY;
        vm.currentLocation = [];
        vm.markers = [];
        vm.mapBounds = null;
        vm.zoom = 16;
        vm.address = "";

        vm.setAddress = setAddress;

        if ($localStorage.selectedLocation) {
            vm.currentLocation = [$localStorage.selectedLocation.lat, $localStorage.selectedLocation.lng];
            vm.address = $localStorage.selectedLocation.address;
        }

        /**
         * Private block
         */
        var _scheduleUpdateTimeout = null,
            _isUpdating = false;

        init();

        function init() {
            if ($localStorage.selectedLocation) {
                for (var i = 0; i < bikes.length; i++) {
                    vm.markers.push([bikes[i].lat, bikes[i].lng]);
                }
            }
            else {
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
                        for (var i = 0; i < bikes.length; i++) {
                            vm.markers.push([bikes[i].lat, bikes[i].lng]);
                        }
                    });
            }

            $scope.$watch('vm.mapBounds', function (bounds) {
                scheduleUpdate();
            });


        }

        function scheduleUpdate() {
            $timeout.cancel(_scheduleUpdateTimeout);
            if (_isUpdating || !vm.mapBounds) return;
            _scheduleUpdateTimeout = $timeout(function () {
                _isUpdating = true;
                searchDataService.loadBikes(vm.mapBounds.sw.lng, vm.mapBounds.ne.lng, vm.mapBounds.sw.lat, vm.mapBounds.ne.lat)
                    .then(function (bikes) {
                        vm.markers = [];
                        for (var i = 0; i < bikes.length; i++) {
                            vm.markers.push([bikes[i].lat, bikes[i].lng]);
                        }
                    })
                    .finally(function () {
                        _isUpdating = false;
                    });
            }, 300);
        }

        function setAddress() {
            $state.go('app.address');
        }

    }

});