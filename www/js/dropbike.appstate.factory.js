/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */

define([
    "angular"
], function (angular) {

        'use strict';

        angular.module('dropbike').factory('appstate', appstate);

        appstate.$inject = ['$localStorage'];

        function appstate($localStorage) {

            if (!$localStorage.hasOwnProperty('appstate')) {
                $localStorage.appstate = {};
            }

            return {
                getMode: getMode,
                setMode: setMode
            }

            function getMode() {
                if (!$localStorage.appstate.mode) {
                    return 'default';
                }
                return $localStorage.appstate.mode;
            }

            function setMode(mode) {
                if (['default', 'share'].indexOf(mode) != -1) {
                    $localStorage.appstate.mode = mode;
                }
            }

        }

    }

);