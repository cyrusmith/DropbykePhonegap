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
            pickAndUpload: pickAndUpload,
            pick: pick,
            upload: upload
        }

        function pick(src) {

            var d = $q.defer();

            if (!window.cordova || !navigator.camera || !window.FileTransfer) {
                return $q.reject("Camera app is not available");
            }
            else {
                navigator.camera.getPicture(function onSuccess(fileURI) {
                    d.resolve(fileURI);
                }, function onFail(msg) {
                    d.reject("Failed to pick photo: " + msg);
                }, {
                    sourceType: src == "gallery" ? navigator.camera.PictureSourceType.PHOTOLIBRARY : navigator.camera.PictureSourceType.CAMERA,
                    quality: 51,
                    targetWidth: 1200,
                    destinationType: navigator.camera.DestinationType.FILE_URI
                });
            }
            return d.promise;

        }

        function upload(fileUri, uploadUrl, fileKey, mimeType) {

            if (!window.cordova || !navigator.camera || !window.FileTransfer) {
                return $q.reject("Camera is app not available");
            }

            if (!fileUri) {
                return $q.reject("Photo is empty");
            }

            var retries = 0,
                d = $q.defer();

            function clearCache() {
                navigator.camera.cleanup();
            }

            function doUpload(fileURI) {
                var win = function (r) {
                    clearCache();
                    retries = 0;
                    d.resolve(true);
                }

                var fail = function (error) {
                    if (retries == 0) {
                        retries++
                        setTimeout(function () {
                            doUpload(fileURI)
                        }, 1000)
                    } else {
                        retries = 0;
                        clearCache();
                        d.reject(error);
                    }
                }

                var options = new FileUploadOptions();
                options.fileKey = fileKey;
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                options.mimeType = mimeType;
                options.params = {};
                options.headers = {
                    "Authorization": "Bearer " + authService.getToken()
                };
                var ft = new FileTransfer();
                ft.upload(fileURI, encodeURI(uploadUrl), win, fail, options);
            }

            doUpload(fileUri);

            return d.promise;
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
                    targetWidth: 1200,
                    destinationType: navigator.camera.DestinationType.FILE_URI
                });
            }
            return d.promise;
        }

    }

});
