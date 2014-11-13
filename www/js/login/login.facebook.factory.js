define([
    "angular"
], function (angular) {

    "use strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', '$log', '$localStorage', '$interval', 'FACEBOOK_ID'];

    function facebook($q, $log, $localStorage, $interval, FACEBOOK_ID) {

        $log.log("facebookId", FACEBOOK_ID);

        var apiDeferred;

        init();

        return {
            getApi: getApi,
            postUpdate: function () {
                if (!$localStorage.facebook) {
                    return;
                }
                getApi()
                    .then(function () {
                        facebookConnectPlugin.api('/' + $localStorage.facebook.id + '/feed');
                    });
            }
        };

        function init() {

            apiDeferred = $q.defer();

            if (!window.cordova) {

                waitForFB()
                    .then(function () {
                        $log.log("Facebook loaded");
                        apiDeferred.resolve(facebookConnectPlugin);
                        facebookConnectPlugin.browserInit(FACEBOOK_ID);
                    }, function () {
                        $log.log("Failed to load facebook");
                        apiDeferred.reject(null);
                    })
            }
            else {
                $log.log("Cordova detected. Return plugin immediately: " + facebookConnectPlugin);
                waitForCordovaPlugin().
                    then(function () {
                        apiDeferred.resolve(facebookConnectPlugin);
                    }, function () {
                        apiDeferred.reject(null);
                    });

            }

        }

        function getApi() {
            return apiDeferred.promise;
        }

        function waitForFB() {

            var d = $q.defer(),
                count = 0;

            var intrvl = $interval(function () {
                if (count > 100) {
                    $interval.cancel(intrvl);
                    d.reject(null);
                }
                else if (window.FB) {
                    $interval.cancel(intrvl);
                    d.resolve(window.FB)
                }
                else {
                    count++;
                }
            }, 100);
            return d.promise;
        }

        function waitForCordovaPlugin() {

            var d = $q.defer(),
                count = 0;

            var intrvl = $interval(function () {
                if (count > 100) {
                    $interval.cancel(intrvl);
                    d.reject(null);
                }
                else if (window.facebookConnectPlugin) {
                    $interval.cancel(intrvl);
                    d.resolve(window.facebookConnectPlugin)
                }
                else {
                    count++;
                }
            }, 100);
            return d.promise;
        }


    }

});