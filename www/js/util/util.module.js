define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.util', []).factory('dropbikeUtil', utils);

    utils.$inject = ['$q', '$window'];

    function utils($q, $window) {

        return {
            loadScript: loadScript
        }

        function loadScript(uri, isLoadSequentially) {
            var d = $q.defer();
            uri += (uri.indexOf("?") == -1) ? "?" : "&";
            uri += "nocache=" + (new Date().getTime());

            var elem = document.createElement("script");
            elem.charset = "utf-8";
            elem.src = uri;

            var readyStateValue = {"complete" : true};
            if (document.documentMode && document.documentMode < 10 ||
                (typeof $window['ActiveXObject'] !== "undefined" && !document.documentMode)) {
                readyStateValue["loaded"] = true;
            }

            elem.onreadystatechange = elem.onload = function () {
                if (!this.readyState || readyStateValue[this.readyState]) {
                    elem.onreadystatechange = elem.onload = null;
                    d.resolve(uri);
                }
            };

            if (isLoadSequentially) {
                elem.async = null;
            }

            var head = document.getElementsByTagName("head")[0];
            head.appendChild(elem);

            return d.promise;
        }

    }

});