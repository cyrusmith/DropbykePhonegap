define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeLocationCtrl', SharingBikeLocationCtrl);

    SharingBikeLocationCtrl.$inject = ['$scope', '$state', 'appstate', 'bikeEditFormDataService', 'mapDataService', '$ionicPopup', '$ionicLoading'];

    function SharingBikeLocationCtrl($scope, $state, appstate, bikeEditFormDataService, mapDataService, $ionicPopup, $ionicLoading) {

        var vm = this;
        vm.address;
        vm.location;
        vm.coords;
        vm.locked;
        vm.editMode;

        vm.apply = apply;
        vm.edit = edit;
        vm.set = set;

        var bikeData;

        init();

        function init() {

            if (appstate.getMode() !== 'share') {
                $state.go('app.search');
                return;
            }

            vm.editMode = false;

            bikeData = bikeEditFormDataService.get();
            if (!bikeData) {
                $state.go("sharing.bike.edit");
                return;
            }
            vm.locked = bikeData.locked;
            if (bikeData.address && bikeData.lat && bikeData.lng) {
                vm.address = bikeData.address;
                vm.location = [bikeData.lat, bikeData.lng];
            }
            else {
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i> Getting your location...'
                });

                mapDataService.getLocation().then(function (pos) {
                    vm.location = [pos.latitude, pos.longitude];
                }, function (error) {
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

            var locInit = false;
            $scope.$watch('vm.location', function (location) {
                if (!locInit) {
                    locInit = true;
                    return;
                }

                if (location) {
                    vm.coords = location[0] + ' | ' + location[1];
                    geoDecode({
                        latitude: location[0],
                        longitude: location[1]
                    });
                }
            });

            if (!vm.locked) {
                $ionicPopup.show({
                    title: "Tap 'Edit' to change location",
                    buttons: [
                        {
                            type: "button-balanced",
                            text: "Ok"
                        }
                    ]
                });
            }
        }

        function edit() {
            vm.editMode = true;
            if (!vm.locked) {
                $ionicPopup.show({
                    title: "Now touch the map to locate bike",
                    buttons: [
                        {
                            type: "button-balanced",
                            text: "Ok"
                        }
                    ]
                });
            }
        }

        function set() {
            vm.editMode = false;
        }

        function geoDecode(location) {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Getting your address...'
            });

            mapDataService.geodecode(location)
                .then(function (results) {
                    if (results && results.length > 0) {
                        vm.address = results[0].formatted_address;
                    }
                }, function (error) {
                    $ionicPopup.show({
                        title: 'Error',
                        subTitle: error.message,
                        buttons: [
                            {
                                "type": "button-assertive",
                                "text": "Ok"
                            }
                        ]
                    });
                }).finally(function () {
                    $ionicLoading.hide();
                });
        }

        function apply() {
            if (vm.locked) {
                return;
            }
            if (!vm.address) {
                $ionicPopup.show({
                    title: 'Address not set',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                return;
            }
            if (!vm.location || !vm.location[0] || !vm.location[1]) {
                $ionicPopup.show({
                    title: 'Coords not set',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                return;
            }
            bikeEditFormDataService.merge({
                address: vm.address,
                lat: vm.location[0],
                lng: vm.location[1]
            });
            $state.go("sharing.bike.edit", {
                bikeId: bikeData.id || 0
            })
        }

    }

});