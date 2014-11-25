define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('SearchController', SearchController);

    SearchController.$inject = ['searchDataService', 'mapDataService', '$ionicLoading', '$timeout', '$log', '$state', '$scope', '$localStorage'];

    function SearchController(searchDataService, mapDataService, $ionicLoading, $timeout, $log, $state, $scope, $localStorage) {

        var vm = this;

        vm.currentLocation;
        vm.markers;
        vm.mapBounds;
        vm.zoom;
        vm.address;
        vm.locationError;

        vm.setAddress = setAddress;
        vm.getCurrentLocation = getCurrentLocation;
        vm.onMarkerClick = onMarkerClick;

        /**
         * Private block
         */
        var _scheduleUpdateTimeout = null,
            _isUpdating = false,
            _bikes = [];

        init();

        function init() {

            vm.currentLocation = [];
            vm.markers = [];
            vm.mapBounds = null;
            vm.zoom = 16;
            vm.address = "";

            if ($localStorage.selectedLocation) {
                vm.currentLocation = [$localStorage.selectedLocation.lat, $localStorage.selectedLocation.lng];
                vm.address = $localStorage.selectedLocation.address;
            }

            if ($localStorage.selectedLocation) {
                for (var i = 0; i < _bikes.length; i++) {
                    vm.markers.push([_bikes[i].lat, _bikes[i].lng]);
                }
            }
            else {
                doGetLocation().
                    finally(function () {
                        for (var i = 0; i < _bikes.length; i++) {
                            vm.markers.push([_bikes[i].lat, _bikes[i].lng]);
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
                    .then(function (res) {
                        _bikes = res;
                        vm.markers = [];
                        for (var i = 0; i < _bikes.length; i++) {
                            vm.markers.push([_bikes[i].lat, _bikes[i].lng]);
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

        function onMarkerClick(index) {
            if (!_bikes[index]) {
                $log.error('Illegal state: unknown bike with index ' + index);
                return;
            }
            $log.log("Goto to bike", _bikes[index].id);
            $state.go('app.bike', {
                bikeId: _bikes[index].id
            });
        }

        function getCurrentLocation() {
            doGetLocation();
        }

        function doGetLocation() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your location...'
            });
            return mapDataService.getLocation()
                .then(function (pos) {
                    vm.locationError = null;
                    vm.currentLocation = [pos.latitude, pos.longitude];
                    mapDataService.geodecode(pos)
                        .then(function (address) {
                            if (address.length && !vm.address) {
                                vm.address = address[0].formatted_address;
                            }
                        });
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    vm.locationError = error;
                    vm.currentLocation = null;
                });
        }

    }

});