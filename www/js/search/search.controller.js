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
        vm.nearest;

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
            vm.locationError = null;

            if ($localStorage.selectedLocation) {
                vm.currentLocation = [$localStorage.selectedLocation.lat, $localStorage.selectedLocation.lng];
                vm.address = $localStorage.selectedLocation.address;
            } else {
                doGetLocation().
                    finally(function () {
                        scheduleUpdate();
                    });

            }

            $scope.$watch('vm.mapBounds', function (bounds) {
                scheduleUpdate();
            });

            scheduleUpdate();

        }

        function scheduleUpdate() {
            $timeout.cancel(_scheduleUpdateTimeout);
            if (_isUpdating || !vm.mapBounds) return;
            _scheduleUpdateTimeout = $timeout(function () {
                _isUpdating = true;
                searchDataService.loadBikes(vm.mapBounds.sw.lng, vm.mapBounds.ne.lng, vm.mapBounds.sw.lat, vm.mapBounds.ne.lat, vm.currentLocation[0], vm.currentLocation[1])
                    .then(function (res) {
                        _bikes = res.bikes;
                        vm.nearest = res.nearest;
                        vm.markers = [];
                        for (var i = 0; i < _bikes.length; i++) {
                            vm.markers.push([_bikes[i].lat, _bikes[i].lng, res.user.id === _bikes[i].user.id ? "state1" : null]);
                        }
                        console.log(vm.markers);
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
            vm.address = null;
            doGetLocation();
        }

        function doGetLocation() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your location...'
            });
            return mapDataService.getLocation()
                .then(function (pos) {
                    vm.locationError = null;
                    $localStorage.selectedLocation = null;
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
                    vm.locationError = error.message;
                    vm.currentLocation = null;
                });
        }

    }

});