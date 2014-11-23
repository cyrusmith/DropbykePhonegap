define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.util', []);

    require([
        "util/util.factory",
        "util/util.camera.factory",
        "util/util.upload.factory",
        "util/util.directive"
    ])

});