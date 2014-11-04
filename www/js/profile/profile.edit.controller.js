define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileEditController', ProfileEditController);
    ProfileEditController.$inject = ['profile', 'profileDataService', '$ionicPopup', '$ionicLoading', 'BACKEND_URL', '$log', '$state', 'confirmService'];
    function ProfileEditController(profile, profileDataService, $ionicPopup, $ionicLoading, BACKEND_URL, $log, $state, confirmService) {

        var vm = this;

        vm.profile = profile.user;
        vm.save = save;
        vm.pickPhoto = pickPhoto;

        vm.profile.photo = BACKEND_URL + '/images/users/' + vm.profile.id + '.jpg?nocache' + (new Date()).getTime();

        function save() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });
            profileDataService.updateProfile(vm.profile.name, vm.profile.email)
                .then(function () {
                    $state.go('app.profileview');
                }, function (error) {
                    $ionicPopup.show({
                        title: 'Error',
                        subTitle: 'Failed to save profile: ' + error,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function pickPhoto() {
            $ionicPopup.show({
                title: 'Choose image source',
                buttons: [
                    {
                        text: '<i class="ion ion-camera"></i> Camera',
                        onTap: function () {
                            return "camera";
                        }
                    },
                    {
                        text: '<i class="ion ion-ios7-folder"></i> Gallery',
                        onTap: function () {
                            return "gallery";
                        }
                    }
                ]
            }).then(function (src) {
                    $ionicLoading.show({
                        template: '<i class="icon ion-loading-c"></i> Loading...'
                    });
                    return profileDataService.updatePhoto(src);
                })
                .then(function () {
                    vm.profile.photo = BACKEND_URL + '/images/users/' + vm.profile.id + '.jpg?nocache' + (new Date()).getTime();
                }, function (error) {
                    $ionicPopup.show({
                        title: 'Error',
                        subTitle: 'Failed to upload photo: ' + error,
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                })
                .finally(function () {
                    $ionicLoading.hide();
                });

        }


    }

});