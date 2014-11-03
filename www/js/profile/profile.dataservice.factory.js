/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.phone').factory('profileDataService', profileDataService);

    profileDataService.$inject = ['$q', '$http', '$log', 'authService', 'BACKEND_URL'];

    function profileDataService($q, $http, $log, authService, BACKEND_URL) {

        return {
            getProfile: getProfile,
            updateProfile: updateProfile,
            updatePhoto: updatePhoto
        };

        function getProfile() {
            return $http.get(BACKEND_URL + '/api/profile', {

                    headers: {
                        "Authorization": "Bearer " + authService.getToken()
                    }
                }
            ).then(function success(resp) {
                    $log.log("getProfile success", resp);
                    return resp.data.profile;
                }, function fail(resp) {
                    $log.log("getProfile fail", resp);
                    $q.reject(resp);
                });
        }

        function updateProfile(name, email) {
            return $http.post(BACKEND_URL + '/api/profile', {
                    name: name,
                    email: email
                }, {
                    headers: {
                        "Authorization": "Bearer " + authService.getToken()
                    }
                }
            ).then(function success(resp) {
                    $log.log("getProfile success", resp);
                    return resp.data.profile;
                }, function fail(resp) {
                    $log.log("getProfile fail", resp);
                    $q.reject(resp);
                });
        }

        function updatePhoto(src) {
            var d = $q.defer(),
                retries = 0;

            function clearCache() {
                navigator.camera.cleanup();
            }

            function onCapturePhoto(fileURI) {
                alert('onCapturePhoto ' + fileURI);
                var win = function (r) {
                    clearCache();
                    retries = 0;
                    d.resolve(true);
                    alert('Done!');
                }

                var fail = function (error) {
                    var e = [];
                    for (var p in error) {
                        if (error.hasOwnProperty(p)) {
                            e.push(p + ": " + error[p])
                        }
                    }
                    alert('fail ' + retries + " err: {" + e.join("\n") + "}");

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
                ft.upload(fileURI, encodeURI(BACKEND_URL + "/api/profile/photo"), win, fail, options);
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
