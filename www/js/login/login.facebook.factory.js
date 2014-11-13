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

            if (window.facebookConnectPlugin) {
                window.facebookConnectPlugin.browserInit(FACEBOOK_ID);
            }
        }

        function getLoginStatus() {
            var d = $q.defer();

            if (window.facebookConnectPlugin) {
                window.facebookConnectPlugin.getLoginStatus(function (res) {
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
                    d.reject(false);
                });
            }
            else {
                if (FacebookInAppBrowser.getInfo(function (res) {
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


            return d.promise;
        }

        function login() {

            var d = $q.defer();

            if (window.facebookConnectPlugin) {

                facebookConnectPlugin.login(['public_profile', 'user_photos', 'email'], function (res) {

                        facebookConnectPlugin.login(['publish_actions'], function (res) {

                            facebookConnectPlugin.api('/me', null, function (meResp) {

                                window.localStorage.setItem('facebookAccessToken', res.authResponse.accessToken);
                                window.localStorage.setItem('uid', res.authResponse.userID);

                                $localStorage.facebook = meResp;

                                facebookConnectPlugin.api("/me/picture?type=large&redirect=0", null, function (picResp) {
                                    if (picResp && picResp.data && picResp.data.url) {
                                        $localStorage.facebook = angular.extend({}, $localStorage.facebook, {
                                            image: picResp.data.url
                                        });
                                    }
                                    d.resolve(true);
                                }, function (err) {
                                    d.resolve(true);
                                });

                            }, function (err) {
                                d.reject(err);
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
                        if (access_token) {
                        } else {
                            d.reject('no access token');
                        }
                    },
                    userInfo: function (userInfo) {
                        if (userInfo) {
                            $localStorage.facebook = userInfo;
                            d.resolve(userInfo);
                        } else {
                            d.reject('no user info');
                        }
                    }
                });

            }


            return d.promise;
        }

        function postUpdate(message, description, name, link, picture) {
            var d = $q.defer();

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