define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').controller('ProfileEditController', ProfileEditController);
    ProfileEditController.$inject = ['profile', 'profileDataService', '$ionicPopup', '$ionicLoading', '$localStorage', 'BACKEND_URL', '$log', '$state', 'confirmService'];
    function ProfileEditController(profile, profileDataService, $ionicPopup, $ionicLoading, $localStorage, BACKEND_URL, $log, $state, confirmService) {

        var vm = this;

        vm.loading;
        vm.profile;

        vm.save = save;
        vm.pickPhoto = pickPhoto;

        init();

        function init() {
            vm.loading = false;
            vm.profile = profile.user;
            vm.profile.photo = BACKEND_URL + '/images/users/' + vm.profile.id + '.jpg?nocache' + (new Date()).getTime();

            if ($localStorage.facebook) {
                if ($localStorage.facebook.email) {
                    vm.profile.email = $localStorage.facebook.email;
                }
                if ($localStorage.facebook.name) {
                    vm.profile.name = $localStorage.facebook.name;
                }
                if ($localStorage.facebook.image) {
                    vm.profile.photo = $localStorage.facebook.image;
                }
            }
        }

        function save() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });
            profileDataService.updateProfile(vm.profile.name, vm.profile.email)
                .then(function () {
                    if ($localStorage.facebook) {
                        $localStorage.facebook.name = null;
                        $localStorage.facebook.email = null;
                    }
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
            if (vm.loading) return;
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
                    vm.loading = true;
                    return profileDataService.updatePhoto(src);
                })
                .then(function () {
                    if ($localStorage.facebook) {
                        $localStorage.facebook.image = null;
                    }
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
                    vm.loading = false;
                });

        }


    }

});