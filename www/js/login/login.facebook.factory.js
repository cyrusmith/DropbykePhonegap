define([
    "angular"
], function (angular) {

    "use strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', '$http', '$log', '$localStorage', 'authService', 'FACEBOOK_ID', 'FACEBOOK_REDIRECT_URL', 'BACKEND_URL'];

    function facebook($q, $http, $log, $localStorage, authService, FACEBOOK_ID, FACEBOOK_REDIRECT_URL, BACKEND_URL) {

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

            if (window.facebookConnectPlugin && window.facebookConnectPlugin.browserInit) {
                window.facebookConnectPlugin.browserInit(FACEBOOK_ID);
            }
        }

        function getLoginStatus() {
            var d = $q.defer();

            if (window.facebookConnectPlugin) {
                window.facebookConnectPlugin.getLoginStatus(function (res) {
                    if (res.status && res.status == "connected" && res.authResponse && res.authResponse.accessToken) {
                        window.localStorage.setItem('facebookAccessToken', res.authResponse.accessToken);
                        window.localStorage.setItem('uid', res.authResponse.userID);
                        d.resolve(true);
                    }
                    else {
                        d.reject(false);
                    }

                }, function (res) {
                    d.reject(false);
                });
            }
            else {
                if (FacebookInAppBrowser.getInfo(function (userInfo) {
                    if (userInfo === false) {
                        d.reject(false);
                    }
                    else {
                        $localStorage.facebook = userInfo;
                        d.resolve(userInfo);
                    }
                }) === false) {
                    d.reject(false);
                }
            }

            return d.promise;
        }

        function login() {

            var d = $q.defer();

            if (window.facebookConnectPlugin) {

                facebookConnectPlugin.login(['public_profile', 'user_photos', 'email'], function (res) {

                        facebookConnectPlugin.login(['publish_actions'], function (res) {

                            window.localStorage.setItem('facebookAccessToken', res.authResponse.accessToken);
                            window.localStorage.setItem('uid', res.authResponse.userID);

                            $http.post(BACKEND_URL + '/api/loginFacebook', {
                                "uid": res.authResponse.userID,
                                "token": res.authResponse.accessToken
                            }).then(function (resp) {
                                    $log.log("/api/loginFacebook", resp);
                                    if (resp.data.access_token) {
                                        authService.setToken(resp.data.access_token);
                                        d.resolve(resp.data.user_info.user);
                                    }
                                    else {
                                        d.reject(false);
                                    }
                                }, function (err) {
                                    $log.error("/api/loginFacebook", err);
                                    if (err.data.error) {
                                        d.reject(err.data.error);
                                    }
                                    else {
                                        d.reject(false);
                                    }
                                });

                        }, function (err) {
                            d.reject(err);
                        });

                    }, function (err) {
                        d.reject(err);
                    }
                )
            }
            else {
                //TODO
                FacebookInAppBrowser.login({
                    send: function () {
                    },
                    success: function (access_token) {
                    },
                    denied: function () {
                        d.reject('user denied');
                    },
                    timeout: function () {
                        d.reject('a timeout has occurred, probably a bad internet connection');
                    },
                    complete: function (access_token) {
                    },
                    userInfo: function (userInfo) {
                    }
                });

            }


            return d.promise;
        }

        function postUpdate(message, description, name, link, picture) {
            var d = $q.defer();

            //d.resolve();return d.promise;

            if (!FacebookInAppBrowser) {
                d.reject();
            } else if (!message || !description || !name || !link || !picture) {
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