/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.util').directive('bgImage', bgImage);

    bgImage.$inject = [];

    function bgImage() {

        return function (scope, element, attrs) {
            scope.$watch(attrs.bgImage, function(url) {
                element.css({
                    'background-position': '50% 50%',
                    'background-image': 'url(' + url +')',
                    'background-size' : '100% auto'
                });
            })
        };

    }

});

