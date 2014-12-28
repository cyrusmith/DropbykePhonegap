/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.usage', []);

    require([
        "usage/usage.access.controller",
        "usage/usage.map.controller",
        "usage/usage.drop.controller",
        "usage/usage.drop.address.controller",
        "usage/usage.photo.controller",
        "usage/usage.dataservice.factory"
    ]);

});
