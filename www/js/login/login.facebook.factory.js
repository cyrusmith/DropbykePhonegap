define([
    "angular"
], function (angular) {

    "use strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', 'FACEBOOK_ID'];

    function facebook($q, FACEBOOK_ID) {

        init();

        return {
            login: login,
            getLoginStatus: getLoginStatus,
            postUpdate: postUpdate
        };

        function init() {
            FacebookInAppBrowser.settings.appId = FACEBOOK_ID;
            FacebookInAppBrowser.settings.redirectUrl = 'http://ec2-54-69-186-125.us-west-2.compute.amazonaws.com:8080/';
            FacebookInAppBrowser.settings.permissions = 'public_profile,user_photos,email,publish_actions';
        }

        function getLoginStatus() {
            var d = $q.defer();
            FacebookInAppBrowser.getInfo(function (res) {
                if (res === false) {
                    d.reject(false);
                }
                else {
                    d.resolve(res);
                }
            });
            return d.promise;
        }

        function login() {

            var d = $q.defer();

            FacebookInAppBrowser.login({
                send: function () {
                    console.log('login opened');
                },
                success: function (access_token) {
                    console.log('done, access token: ' + access_token);
                },
                denied: function () {
                    d.reject('user denied');
                    console.log('user denied');
                },
                timeout: function () {
                    console.log('a timeout has occurred, probably a bad internet connection');
                    d.reject('a timeout has occurred, probably a bad internet connection');
                },
                complete: function (access_token) {
                    console.log('window closed');
                    if (access_token) {
                        console.log(access_token);
                    } else {
                        console.log('no access token');
                        d.reject('no access token');
                    }
                },
                userInfo: function (userInfo) {
                    if (userInfo) {
                        d.resolve(userInfo);
                        console.log(JSON.stringify(userInfo));
                    } else {
                        d.reject('no user info');
                        console.log('no user info');
                    }
                }
            });

            return d.promise;
        }

        function postUpdate(message, description, name, link, picture) {
            var d = $q.defer();

            if (!message || !description || !name || !link || !picture) {
                d.reject();
            }
            else if (FacebookInAppBrowser.post({
                message: message,
                description: description,
                name: name,
                link: link,
                picture: picture
            }, function (resp) {
                if (resp === false) {
                    d.reject();
                }
                else {
                    d.resolve(resp);
                }
            }) === false) {
                d.reject();
            }

            return d.promise;
        }

    }

});