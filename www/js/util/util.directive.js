/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.util').directive('bgImage', function bgImage() {

        return function (scope, element, attrs) {
            scope.$watch(attrs.bgImage, function (url) {
                element.css({
                    'background-position': '50% 50%',
                    'background-image': 'url(' + url + ')',
                    'background-size': '100% auto'
                });
            })
        };

    });

    angular.module('dropbike.util').directive('timerElapsed', ['$interval', function timerElapsed($interval) {

        return function (scope, element, attrs) {

            var _interval = null;

            scope.$watch(attrs.timerElapsed, function () {
                _interval = $interval(function () {

                    if (attrs.timerElapsed) {
                        var elapsed = parseInt(attrs.timerElapsed),
                            now = Date.now();

                        var time = parseInt((now - elapsed) / 1000),
                            s = time % 60,
                            h = parseInt(time / 3600),
                            m = parseInt(time / 60) % 60;

                        element.text(nn(h) + ':' + nn(m) + ':' + nn(s));
                    }

                }, 1000);


            });


            element.on('$destroy', function () {
                $interval.cancel(_interval);
            });
        };

        function nn(num) {
            return num > 9 ? num + "" : "0" + num;
        }

    }]);


});

