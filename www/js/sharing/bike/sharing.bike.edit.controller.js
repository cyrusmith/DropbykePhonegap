define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeEditCtrl', SharingBikeEditCtrl);

    SharingBikeEditCtrl.$inject = ['bike', '$scope', '$log', '$state', '$ionicPopup', '$ionicLoading', 'sharingBikeDataService', 'BACKEND_URL'];

    function SharingBikeEditCtrl(bike, $scope, $log, $state, $ionicPopup, $ionicLoading, sharingBikeDataService, BACKEND_URL) {

        var vm = this;
        
        vm.id;
        vm.photo;
        vm.active;
        vm.name;
        vm.sku;
        vm.price;
        vm.lockPassword;
        vm.address;
        vm.lat;
        vm.lng;
        vm.message;

        vm.save = save;

        init();

        function init() {

            console.log($scope.address);

            if (bike) {
                vm.id = bike.id;
                vm.photo = BACKEND_URL + '/images/bikes/' + bike.id + '.jpg';
                vm.active = bike.active;
                vm.name = bike.title;
                vm.sku = bike.sku;
                vm.price = bike.priceRate;
                vm.lockPassword = bike.lockPassword;
                vm.address = bike.address;
                vm.lat = bike.lat;
                vm.lng = bike.lng;
                vm.message = bike.messageFromLastUser;
            }
            else if($scope.biketmp) {
                vm.id = $scope.biketmp.id;
                vm.photo = $scope.biketmp.photo;
                vm.active = $scope.biketmp.active;
                vm.name = $scope.biketmp.title;
                vm.sku = $scope.biketmp.sku;
                vm.price = $scope.biketmp.priceRate;
                vm.lockPassword = $scope.biketmp.lockPassword;
                vm.address = $scope.biketmp.address;
                vm.lat = $scope.biketmp.lat;
                vm.lng = $scope.biketmp.lng;
                vm.message = $scope.biketmp.messageFromLastUser;
            }
            $log.log('SharingBikeEditCtrl', bike);
        }

        function save() {

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });

            sharingBikeDataService.saveBike({
                active: vm.active,
                name: vm.name,
                sku: vm.sku,
                price: vm.price,
                lockPassword: vm.lockPassword,
                address: vm.address,
                lat: vm.lat,
                lng: vm.lng,
                message: vm.message
            }).then(function () {
                    $state.go('sharing.mybikes');
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

    }

});