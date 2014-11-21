define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.sharing').controller('SharingBikePhotoCtrl', SharingBikePhotoCtrl);

    SharingBikePhotoCtrl.$inject = ['$scope', '$state', 'cameraUtil'];

    function SharingBikePhotoCtrl($scope, $state, cameraUtil) {

        var vm = this;

        vm.photo;

        vm.takePhoto = takePhoto;
        vm.save = save;

        init();

        function init() {
            console.log('SharingBikePhotoCtrl');
        }

        function takePhoto() {

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
                alert('Photo not set');
            }
            else {
                $scope.$parent.photo = vm.photo;
                $state.go('sharing.bike.edit', {
                    bikeId: vm.id || 0
                });
            }
        }

    }

});