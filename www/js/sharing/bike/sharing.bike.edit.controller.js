define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeEditCtrl', SharingBikeEditCtrl);

    SharingBikeEditCtrl.$inject = ['bike', 'bikeEditFormDataService', '$scope', '$state', '$ionicPopup', '$ionicLoading', 'sharingBikeDataService', 'BACKEND_URL'];

    function SharingBikeEditCtrl(bike, bikeEditFormDataService, $scope, $state, $ionicPopup, $ionicLoading, sharingBikeDataService, BACKEND_URL) {

        var vm = this;

        vm.bike;

        vm.save = save;
        vm.isValid = isValid;

        init();

        function init() {

            console.log('SharingBikeEditCtrl 1', bike, bikeEditFormDataService.get());

            var data = bikeEditFormDataService.get();

            if (!data) {
                if (bike) {
                    vm.bike = bike;
                }
                else {
                    vm.bike = {};
                }
            }
            else {
                vm.bike = data;
            }

            if (vm.bike.newPhoto) {
                vm.bike.photo = vm.bike.newPhoto;
            }
            else if (vm.bike.id) {
                vm.bike.photo = BACKEND_URL + '/images/bikes/' + vm.bike.id + '.jpg?nocache=' + Date.now();
            }

            if (!vm.bike.active) {
                vm.bike.active = false;
            }

            if (vm.bike.lastRideId) {
                vm.bike.userPhoto = BACKEND_URL + '/images/rides/' + vm.bike.lastRideId + '.jpg';
            }

            $scope.$watch('vm.bike', function (bike) {
                bikeEditFormDataService.merge(bike)
            }, true);

            if (vm.bike.locked) {
                $ionicPopup.show({
                    title: 'Bike is in use',
                    subTitle: 'You cannot edit bike until it is dropped',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-energized'
                        }
                    ]
                })
            }

        }

        function save() {

            if (!isValid()) {
                $ionicPopup.show({
                    title: "Check that all fields are set",
                    buttons: [
                        {
                            type: 'button-assertive',
                            text: 'Ok'
                        }
                    ]
                });
                return;
            }

            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });

            sharingBikeDataService.saveBike(vm.bike, vm.bike.newPhoto ? vm.bike.newPhoto : null).then(function (createdBike) {
                if (!vm.bike.id) {
                    return sharingBikeDataService.uploadUserPhoto(createdBike.id, vm.bike.userPhoto);
                }
                else {
                    return true;
                }

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

        function isValid() {
            return sharingBikeDataService.isValid(vm.bike) && (!vm.bike.id ? (vm.bike.newPhoto && vm.bike.userPhoto) : true);
        }


    }

});