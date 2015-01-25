define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikePhotoCtrl', SharingBikePhotoCtrl);

    SharingBikePhotoCtrl.$inject = ['targetField', 'initImage', 'bikeEditFormDataService', '$state', 'appstate', '$ionicPopup', 'cameraUtil', 'BACKEND_URL', '$log'];

    function SharingBikePhotoCtrl(targetField, initImage, bikeEditFormDataService, $state, appstate, $ionicPopup, cameraUtil, BACKEND_URL, $log) {

        var vm = this;

        vm.photo;
        vm.locked;

        vm.takePhoto = takePhoto;
        vm.save = save;

        var bikeData;

        init();

        function init() {

            if (appstate.getMode() !== 'share') {
                $state.go('app.search');
                return;
            }

            if (!targetField) {
                throw "Illegal argument: targetField is not set";
            }

            $log.log("targetField=" + targetField);

            bikeData = bikeEditFormDataService.get();
            vm.locked = bikeData.locked || (targetField == 'userPhoto' && bikeData.id);
            if (bikeData) {
                if (bikeData[targetField]) {
                    vm.photo = bikeData[targetField];
                }
                else if (initImage) {
                    vm.photo = initImage;
                }
            }
        }

        function takePhoto() {
            if (vm.locked) {
                return;
            }
            if (!window.cordova) {
                vm.photo = "file://dummy.jpg";
                return;
            }

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
                cameraUtil.pick(src)
                    .then(function (uri) {
                        vm.photo = uri;
                    }, function (error) {
                        $ionicPopup.show({
                            title: 'Error',
                            subTitle: 'Failed to get photo: ' + error,
                            buttons: [
                                {
                                    text: 'Ok',
                                    type: 'button-assertive'
                                }
                            ]
                        });
                    });
            });

        }

        function save() {
            if (!vm.photo) {
                $ionicPopup.show({
                    title: 'Photo not set',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
            else {
                var obj = {};
                obj[targetField] = vm.photo;
                bikeEditFormDataService.merge(obj);
                $state.go('sharing.bike.edit', {
                    bikeId: bikeData.id || 0
                });
            }
        }

    }

});