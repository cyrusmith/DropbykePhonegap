/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.util').factory('cameraUtil', cameraUtil);

    cameraUtil.$inject = ['$q', 'authService'];

    function cameraUtil($q, authService) {

        return {
            pickAndUpload: pickAndUpload
        }

        function pickAndUpload(src, uploadUrl) {
            var d = $q.defer(),
                retries = 0;

            function clearCache() {
                navigator.camera.cleanup();
            }

            function onCapturePhoto(fileURI) {
                var win = function (r) {
                    clearCache();
                    retries = 0;
                    d.resolve(true);
                }

                var fail = function (error) {
                    var e = [];
                    for (var p in error) {
                        if (error.hasOwnProperty(p)) {
                            e.push(p + ": " + error[p])
                        }
                    }

                    if (retries == 0) {
                        retries++
                        setTimeout(function () {
                            onCapturePhoto(fileURI)
                        }, 1000)
                    } else {
                        retries = 0;
                        clearCache();
                        d.reject(error);
                    }
                }

                var options = new FileUploadOptions();
                options.fileKey = "photo";
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.params = {};
                options.headers = {
                    "Authorization": "Bearer " + authService.getToken()
                };
                var ft = new FileTransfer();
                ft.upload(fileURI, encodeURI(uploadUrl), win, fail, options);
            }

            if (!window.cordova || !navigator.camera || !window.FileTransfer) {
                d.reject("Camera app not available");
            }
            else {
                navigator.camera.getPicture(onCapturePhoto, function onFail(msg) {
                    d.reject("Failed to pick photo: " + msg);
                }, {
                    sourceType: src == "gallery" ? navigator.camera.PictureSourceType.PHOTOLIBRARY : navigator.camera.PictureSourceType.CAMERA,
                    quality: 51,
                    destinationType: navigator.camera.DestinationType.FILE_URI
                });
            }
            return d.promise;
        }

    }

});
