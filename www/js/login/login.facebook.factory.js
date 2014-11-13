define([
    "angular"
], function (angular) {

    "use strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', '$localStorage', 'FACEBOOK_ID', 'FACEBOOK_REDIRECT_URL'];

    function facebook($q, $localStorage, FACEBOOK_ID, FACEBOOK_REDIRECT_URL) {

        init();

        return {
            login: login,
            getLoginStatus: getLoginStatus,
            postUpdate: postUpdate
        };

        function init() {
            FacebookInAppBrowser.settings.appId = FACEBOOK_ID;
            FacebookInAppBrowser.settings.redirectUrl = FACEBOOK_REDIRECT_URL;
            FacebookInAppBrowser.settings.permissions = 'public_profile,user_photos,email,publish_actions';
        }

        function getLoginStatus() {
            var d = $q.defer();

            alert("window.cordova && window.facebookConnectPlugin " + window.cordova + " " + window.facebookConnectPlugin);

            if (window.cordova) {

                if (window.facebookConnectPlugin) {
                    window.facebookConnectPlugin.getLoginStatus(function (res) {
                        alert("facebookConnectPlugin.getLoginStatus " + JSON.stringify(res));
                        if (res.status && res.status == "connected" && res.authResponse && res.authResponse.accessToken) {
                            //Set some data for inappbrowser plugin
                            window.localStorage.setItem('facebookAccessToken', res.authResponse.accessToken);
                            window.localStorage.setItem('uid', res.authResponse.userID);
                            d.resolve(res);
                        }
                        else {
                            d.reject(false);
                        }

                    }, function (res) {
                        alert("facebookConnectPlugin.getLoginStatus fail " + JSON.stringify(res));
                        d.reject(false);
                    });
                }
                else {
                    if (FacebookInAppBrowser.getInfo(function (res) {
                        alert("FacebookInAppBrowser.getInfo " + JSON.stringify(res));
                        if (res === false) {
                            d.reject(false);
                        }
                        else {
                            d.resolve(res);
                        }
                    }) === false) {
                        d.reject(false);
                    }
                }

            }

            return d.promise;
        }

        function login() {

            var d = $q.defer();

            if (window.cordova) {

                if (window.facebookConnectPlugin) {

                    alert("window.facebookConnectPlugin login");

                    facebookConnectPlugin.login(['public_profile', 'user_photos', 'email'], function (res) {
                            alert("facebookConnectPlugin.login READ success " + JSON.stringify(res));

                            facebookConnectPlugin.login(['publish_actions'], function (res) {
                                alert("facebookConnectPlugin.login MANAGE success " + JSON.stringify(res));

                                facebookConnectPlugin.api()

                                window.localStorage.setItem('facebookAccessToken', res.authResponse.accessToken);
                                window.localStorage.setItem('uid', res.authResponse.userID);

                                d.resolve(res);
                            }, function (err) {
                                alert("facebookConnectPlugin.login NAMAGE fail " + JSON.stringify(err));
                                d.reject(err);
                            });

                        }, function (err) {
                            alert("facebookConnectPlugin.login fail " + JSON.stringify(err));
                            d.reject(err);
                        }
                    )
                }
                else {
                    alert("FacebookInAppBrowser.login");
                    FacebookInAppBrowser.login({
                        send: function () {
                            alert('login opened');
                        },
                        success: function (access_token) {
                            alert('done, access token: ' + access_token);
                        },
                        denied: function () {
                            alert('user denied');
                            d.reject('user denied');
                        },
                        timeout: function () {
                            alert('a timeout has occurred, probably a bad internet connection');
                            d.reject('a timeout has occurred, probably a bad internet connection');
                        },
                        complete: function (access_token) {
                            alert('window closed ' + access_token);
                            if (access_token) {
                                alert(access_token);
                            } else {
                                alert('no access token');
                                d.reject('no access token');
                            }
                        },
                        userInfo: function (userInfo) {
                            alert("userInfo " + JSON.stringify(userInfo));
                            if (userInfo) {
                                $localStorage.facebook = userInfo;
                                d.resolve(userInfo);
                            } else {
                                d.reject('no user info');
                            }
                        }
                    });

                }

            }

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