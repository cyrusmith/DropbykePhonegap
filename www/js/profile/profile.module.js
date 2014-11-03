/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.profile', []);

    require([
        "profile/profile.view.controller",
        "profile/profile.edit.controller",
        "profile/profile.dataservice.factory"
    ]);

});
