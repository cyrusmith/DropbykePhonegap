/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function () {
    'use strict';

    angular.module('geolocation', []).constant('geolocation_msgs', {
        'errors.location.unsupportedBrowser': 'Browser does not support location services',
        'errors.location.permissionDenied': 'You have rejected access to your location',
        'errors.location.positionUnavailable': 'Unable to determine your location',
        'errors.location.timeout': 'Service timeout has been reached'
    });

    require([
        "geolocation/geolocation.service.factory"
    ]);

});