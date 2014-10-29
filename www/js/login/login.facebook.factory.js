define([
    "angular"
], function (angular) {

    "use strict";

    angular.module('dropbike.login').service('facebook', facebook);

    facebook.$inject = ['$q', '$log', 'FACEBOOK_ID'];

    function facebook($q, $log, FACEBOOK_ID) {

        $log.log("facebookId", FACEBOOK_ID);

        var apiDeferred;

        init();

        return {
            getApi: getApi
        };

        function init() {

            apiDeferred = $q.defer();

            if (!window.cordova) {
                apiDeferred.resolve(facebookConnectPlugin);
                facebookConnectPlugin.browserInit(FACEBOOK_ID);
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