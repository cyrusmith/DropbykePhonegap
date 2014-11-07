define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.card', []);

    require([
        "card/card.controller",
        "card/card.edit.controller",
        "card/card.dataservice.factory"
    ]);

});