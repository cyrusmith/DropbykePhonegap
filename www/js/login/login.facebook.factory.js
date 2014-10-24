define([
    "angular"
], function (angular) {

    "user strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', '$timeout', '$log', 'FACEBOOK_ID'];

    function facebook($q, $timeout, $log, FACEBOOK_ID) {

        $log.log("facebookId", FACEBOOK_ID);

        var apiDeferred;

        init();

        return {
            getApi: getApi
        };

        function init() {

            apiDeferred = $q.defer();

            if (!window.cordova) {

                var fbTimeout = $timeout(function () {
                    apiDeferred.reject(null);
                }, 10000);

                window.fbAsyncInit = function () {
                    apiDeferred.resolve(facebookConnectPlugin);
                    $timeout.cancel(fbTimeout);
                    facebookConnectPlugin.browserInit(FACEBOOK_ID);
                };

                require(["../lib/facebookConnectPlugin"]);
            }
            else {
                apiDeferred.resolve(facebookConnectPlugin);
            }

        }

        function getApi() {
            return apiDeferred.promise;
        }


    }

});