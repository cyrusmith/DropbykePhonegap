/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    angular.module('dropbike.payments').filter('hidecardnumber', function () {
        return function (number) {
            var res = "";
            if (number.length > 4) {
                return " ***" + number.substr(number.length - 4, number.length);
            }
            else {
                return " *** ";
            }
        };
    });

});
