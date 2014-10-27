define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike')

        .config(['$httpProvider', function ($httpProvider) {

            $httpProvider.interceptors.push('connectionErrorInterceptor');

        }]);

});

