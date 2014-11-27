/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('map').factory('sharingHistoryDataService', sharingHistoryDataService);

    sharingHistoryDataService.$inject = ['$http', 'authService', 'BACKEND_URL'];

    function sharingHistoryDataService($http, authService, BACKEND_URL) {

        return {
            loadHistory: loadHistory,
            loadItem: loadItem
        }

        function loadHistory() {
            return $http.get(BACKEND_URL + '/api/share/history', {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (resp) {
                    return resp.data;
                }, function () {
                    return null;
                });
        }

        function loadItem(id) {
            return $http.get(BACKEND_URL + '/api/share/history/' + id, {
                headers: {
                    "Authorization": "Bearer " + authService.getToken()
                }
            }).then(function (resp) {
                    return resp.data;
                }, function () {
                    return null;
                });
        }

    }

});