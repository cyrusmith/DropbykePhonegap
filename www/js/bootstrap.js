define([
    'require',
    'angular',
    'dropbike.module',
    'facebookConnectPlugin',
    'facebookInappbrowser'
], function (require, angular) {
    'use strict';

    require(['domReady!', 'ngStorage'], function (document) {
        angular.bootstrap(document, ['dropbike']);
    });


});