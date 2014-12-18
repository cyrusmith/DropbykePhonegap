define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.mybikes').controller('SharingMyBikesCtrl', SharingMyBikesCtrl);

    SharingMyBikesCtrl.$inject = ['$scope', '$state', '$timeout', '$ionicPopup', '$ionicLoading', 'mapDataService', 'mybikesDataService'];

    function SharingMyBikesCtrl($scope, $state, $timeout, $ionicPopup, $ionicLoading, mapDataService, mybikesDataService) {

        var vm = this;

        vm.location;
        vm.mapBounds;
        vm.locationError;

        vm.getCurrentLocation = getCurrentLocation;
        vm.onMarkerClick = onMarkerClick;

        var _scheduleUpdateTimeout,
            _bikes,
            _isUpdating;

        init();

        function init() {

            vm.locationError = null;

            $scope.$watch('vm.mapBounds', function (bounds) {
                scheduleUpdate();
            });

            getCurrentLocation();

        }

        function onMarkerClick(index) {
            if (!_bikes[index]) {
                $log.error('Illegal state: unknown bike with index ' + index);
                return;
            }
            $state.go('sharing.bike.edit', {
                bikeId: _bikes[index].id
            });
        }

        function scheduleUpdate() {
            $timeout.cancel(_scheduleUpdateTimeout);
            if (_isUpdating || !vm.mapBounds) return;
            _scheduleUpdateTimeout = $timeout(function () {
                _isUpdating = true;
                mybikesDataService.loadBikes(vm.mapBounds.sw.lng, vm.mapBounds.ne.lng, vm.mapBounds.sw.lat, vm.mapBounds.ne.lat)
                    .then(function (res) {
                        _bikes = res;
                        vm.markers = [];
                        for (var i = 0; i < _bikes.length; i++) {
                            var state = null;
                            if (!_bikes[i].active) {
                                state = "state1";
                            }
                            else if (_bikes[i].locked) {
                                state = "state2";
                            }
                            vm.markers.push([_bikes[i].lat, _bikes[i].lng, state]);
                        }
                    })
                    .finally(function () {
                        _isUpdating = false;
                    });
            }, 300);
        }

        function getCurrentLocation() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your location...'
            });

            mapDataService.getLocation().then(function (coords) {
                vm.location = [coords.latitude, coords.longitude];
            },function (error) {
                $ionicPopup.show({
                    title: error.message,
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
            }).finally(function () {
                    $ionicLoading.hide();
                });

        }

    }

});