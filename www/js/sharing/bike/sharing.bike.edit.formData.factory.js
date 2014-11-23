/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('map').factory('bikeEditFormDataService', bikeEditFormDataService);

    bikeEditFormDataService.$inject = [];

    function bikeEditFormDataService() {

        var data = null;

        return {
            set: function (newData) {
                data = newData;
            },
            merge: function (obj) {
                if (!obj) return;
                if (!data) {
                    data = {};
                }
                angular.extend(data, obj);
            },
            get: function () {
                return data;
            }
        }

    }

});
