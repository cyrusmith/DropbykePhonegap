/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.util').factory('uploadUtil', uploadUtil);

    uploadUtil.$inject = ['$q'];

    function uploadUtil($q) {

        return {
            upload: upload
        }

        function upload(uploadUrl, fileUri, fileKey, mimeType, params, headers) {

            if (!window.FileTransfer) {
                return $q.reject("Upload functionality is not available");
            }

            if (!fileUri) {
                return $q.reject("Photo is empty");
            }

            var retries = 0,
                d = $q.defer();

            function doUpload(fileURI) {

                var win = function (r) {
                    alert("WIN! = " + r);
                    retries = 0;
                    d.resolve(r);
                }

                var fail = function (error) {
                    alert("fail! = " + JSON.stringify(error));
                    if (retries == 0) {
                        retries++
                        setTimeout(function () {
                            doUpload(fileURI)
                        }, 1000)
                    } else {
                        retries = 0;
                        var msg = "Failed upload file";
                        if(error.body) {
                            try {
                                var body = JSON.parse(error.body);
                                if(body && body.error) {
                                    msg = body.error;
                                }
                            }
                            catch(e) {}
                        }
                        d.reject(msg);
                    }
                }

                var options = new FileUploadOptions();
                options.fileKey = fileKey;
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                options.mimeType = mimeType;
                if (params) {
                    options.params = params;
                }

                if (headers) {
                    options.headers = headers;
                }

                var ft = new FileTransfer();
                ft.upload(fileURI, encodeURI(uploadUrl), win, fail, options);
            }

            doUpload(fileUri);

            return d.promise;
        }

    }

});
