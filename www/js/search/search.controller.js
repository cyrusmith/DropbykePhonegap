define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('SearchController', SearchController);

    SearchController.$inject = ['bikes', 'GOOGLE_API_KEY', 'geolocation', 'searchDataService', 'mapDataService', '$ionicLoading', '$timeout', '$log', '$state', '$scope', '$localStorage'];

    function SearchController(bikes, GOOGLE_API_KEY, geolocation, searchDataService, mapDataService, $ionicLoading, $timeout, $log, $state, $scope, $localStorage) {

        var vm = this;

        vm.apiKey = GOOGLE_API_KEY;
        vm.currentLocation = [];
        vm.markers = [];
        vm.mapBounds = null;
        vm.zoom = 16;
        vm.address = "";

        vm.setAddress = setAddress;
        vm.applyCurrentLocation = applyCurrentLocation;
        vm.onMarkerClick = onMarkerClick;

        if ($localStorage.selectedLocation) {
            vm.currentLocation = [$localStorage.selectedLocation.lat, $localStorage.selectedLocation.lng];
            vm.address = $localStorage.selectedLocation.address;
        }

        /**
         * Private block
         */
        var _scheduleUpdateTimeout = null,
            _isUpdating = false,
            _bikes = bikes;

        init();

        function init() {
            if ($localStorage.selectedLocation) {
                for (var i = 0; i < _bikes.length; i++) {
                    vm.markers.push([_bikes[i].lat, _bikes[i].lng]);
                }
            }
            else {
                geolocation.getLocation({})
                    .then(function (pos) {
                        vm.currentLocation = [pos.coords.latitude, pos.coords.longitude];
                        mapDataService.geodecode(pos.coords)
                            .then(function (address) {
                                if (address.length) {
                                    vm.address = address[0].formatted_address;
                                }
                            });
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
            console.log(index);
            if (!_bikes[index]) {
                $log.error('Illegal state: unknown bike with index ' + index);
                return;
            }
            $log.log("Goto to bike", _bikes[index].id);
            $state.go('app.bike', {
                bikeId: _bikes[index].id
            });
        }

        function applyCurrentLocation() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Fetching you location...'
            });
            geolocation.getLocation({})
                .then(function (pos) {
                    vm.currentLocation = [pos.coords.latitude, pos.coords.longitude];
                    $localStorage.selectedLocation = null;
                    return pos.coords;
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
                .then(function (location) {
                    return mapDataService.geodecode(location);
                }).then(function (address) {
                    if (address.length) {
                        vm.address = address[0].formatted_address;
                    }

                },function (error) {
                    console.error(error);
                }).finally(function () {
                    $ionicLoading.hide();
                });
            ;
        }

    }

});