/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.checkout').directive('dropbikeCheckoutRating', function dropbikeCheckoutRating() {

        return {
            restrict: 'E',
            scope: {
                rating: '='
            },
            templateUrl: 'js/checkout/checkout.directive.tpl.html',
            link: function (scope, element, attrs) {
                var stars = angular.element(element.children().children()[0]).children();

                stars.on('click', function () {
                    var el = angular.element(this);
                    var pos = +el.attr('data-index');
                    updateSelection(pos);
                    if (attrs.rating) {
                        scope.$apply(function () {
                            scope.rating = pos;
                        });
                    }
                });

                if (attrs.rating) {

                    scope.$watch('rating', function (value) {
                        console.log(attrs.rating, value)
                        updateSelection(value);
                    });

                }

                function updateSelection(pos) {
                    for (var i = 0; i < 5; i++) {
                        var icon = stars.eq(i - 1).children();
                        icon.removeClass('energized');
                    }

                    for (var i = 1; i <= Math.min(pos, 5); i++) {
                        var icon = stars.eq(i - 1).children();
                        icon.addClass('energized');
                    }
                }
            }
        }

    });


});

