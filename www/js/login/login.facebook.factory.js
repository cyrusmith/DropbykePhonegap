define([
    "angular"
], function (angular) {

    "use strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', 'FACEBOOK_ID'];

    function facebook($q, FACEBOOK_ID) {

        init();

        return {
            login: login
        };

        function init() {
            FacebookInAppBrowser.settings.appId = FACEBOOK_ID;
            FacebookInAppBrowser.settings.redirectUrl = 'http://ec2-54-69-186-125.us-west-2.compute.amazonaws.com:8080/';
            FacebookInAppBrowser.settings.permissions = 'email';
        }

        function login() {

            var d = $q.defer();

            FacebookInAppBrowser.login({
                send: function() {
                    console.log('login opened');
                },
                success: function(access_token) {
                    console.log('done, access token: ' + access_token);
                },
                denied: function() {
                    d.reject('user denied');
                    console.log('user denied');
                },
                timeout: function(){
                    console.log('a timeout has occurred, probably a bad internet connection');
                    d.reject('a timeout has occurred, probably a bad internet connection');
                },
                complete: function(access_token) {
                    console.log('window closed');
                    if(access_token) {
                        console.log(access_token);
                    } else {
                        console.log('no access token');
                        d.reject('no access token');
                    }
                },
                userInfo: function(userInfo) {
                    if(userInfo) {
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

    }

});