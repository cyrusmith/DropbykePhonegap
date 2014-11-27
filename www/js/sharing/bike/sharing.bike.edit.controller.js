define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikeEditCtrl', SharingBikeEditCtrl);

    SharingBikeEditCtrl.$inject = ['bike', 'profile', 'bikeEditFormDataService', '$scope', '$state', 'facebook', '$ionicPopup', '$ionicLoading', 'sharingBikeDataService', 'WEBSITE', 'BACKEND_URL'];

    function SharingBikeEditCtrl(bike, profile, bikeEditFormDataService, $scope, $state, facebook, $ionicPopup, $ionicLoading, sharingBikeDataService, WEBSITE, BACKEND_URL) {

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
                if (!vm.bike.id && window.cordova) {
                    return sharingBikeDataService.uploadUserPhoto(createdBike.id, vm.bike.userPhoto);
                }
                else {
                    return createdBike;
                }

            }).then(function (createdBike) {

                    if (vm.bike.active && profile.user.facebookId && profile.user.shareFacebook) {
                        facebook.postUpdate("I've shared bike on Dropbyke.com", "Dropbyke is a bike sharing service", profile.user.name, WEBSITE, BACKEND_URL + '/images/bike/' + createdBike.id + '.jpg')
                            .finally(function () {
                                bikeEditFormDataService.set(null);
                                $state.go('sharing.mybikes');
                            });
                    }
                    else {
                        bikeEditFormDataService.set(null);
                        $state.go('sharing.mybikes');
                    }

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