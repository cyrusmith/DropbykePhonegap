define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing.mybikes').controller('SharingMyBikesCtrl', SharingMyBikesCtrl);

    SharingMyBikesCtrl.$inject = ['$scope', '$timeout', '$ionicPopup', '$ionicLoading', 'mapDataService', 'mybikesDataService'];

    function SharingMyBikesCtrl($scope, $timeout, $ionicPopup, $ionicLoading, mapDataService, mybikesDataService) {

        var vm = this;

        vm.location;
        vm.mapBounds;

        vm.getCurrentLocation = getCurrentLocation;

        var _scheduleUpdateTimeout,
            _bikes,
            _isUpdating;

        init();

        function init() {

            $scope.$watch('vm.mapBounds', function (bounds) {
                scheduleUpdate();
            });

            getCurrentLocation();

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
                    title: error,
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