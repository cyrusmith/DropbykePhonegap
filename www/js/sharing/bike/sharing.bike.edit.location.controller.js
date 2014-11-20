define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeLocationCtrl', SharingBikeLocationCtrl);

    SharingBikeLocationCtrl.$inject = ['$scope', '$state', 'mapDataService', '$ionicPopup', '$ionicLoading'];

    function SharingBikeLocationCtrl($scope, $state, mapDataService, $ionicPopup, $ionicLoading) {

        var vm = this;
        vm.address;
        vm.location;
        vm.coords;

        vm.apply = apply;

        init();

        function init() {
            console.log('SharingBikeLocationCtrl');

            if ($scope.address) {
                vm.address = $scope.address;
            }

            if ($scope.lat && $scope.lng) {
                vm.location = [$scope.lat, $scope.lng];
            }

            $scope.$watch('vm.location', function (location) {
                if (location) {
                    vm.coords = location[0] + ' | ' + location[1];
                    geoDecode({
                        latitude: location[0],
                        longitude: location[1]
                    });
                }
            });
        }

        function geoDecode(location) {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });

            mapDataService.geodecode(location)
                .then(function (results) {
                    if (results && results.length > 0) {
                        vm.address = results[0].formatted_address;
                    }
                    console.log(results);
                },function (error) {
                    $ionicPopup.show({
                        title: 'Error',
                        subTitle: error,
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
            $scope.$parent.address = vm.address;
            $scope.$parent.lat = vm.location[0];
            $scope.$parent.lng = vm.location[1];
            $state.go("sharing.bike.edit")
        }

    }

});