/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.address').factory('addressDataService', addressDataService);

    addressDataService.$inject = ['$q', '$window', '$rootScope', 'dropbikeUtil', 'GOOGLE_API_KEY'];

    function addressDataService($q, $window, $rootScope, dropbikeUtil, GOOGLE_API_KEY) {

        return {
            geocode: geocode
        }

        function geocode(address) {


            var deferred = $q.defer();

            mapApiReady()
                .then(function () {
                    var geocoder = getGeocoder();
                    if (!geocoder) {
                        deferred.reject("No geocoder");
                    }

                    geocoder.geocode({ 'address': address}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            deferred.resolve(results);
                        } else {
                            deferred.reject('Geocode was not successful for the following reason: ' + status);
                        }
                    });

                });

            return deferred.promise;
        }

        function getGeocoder() {
            try {
                return new google.maps.Geocoder();
            }
            catch (err) {
                return null;
            }
        }

        function checkMapLoaded() {
            return $window['google'] && $window['google']['maps']
                && $window['google']['maps']['Map']
        }

        function mapApiReady() {
            var d = $q.defer();
            if (checkMapLoaded()) {
                d.resolve();
            }
            else {
                $window.dropbykeMapLoadedCallback = function () {
                    $window.dropbykeMapLoadedCallback = null;
                    $rootScope.$apply(function () {
                        d.resolve();
                    });
                };
                dropbikeUtil.loadScript("http://maps.googleapis.com/maps/api/js?key="
                    + GOOGLE_API_KEY
                    + "&sensor=false&&callback=dropbykeMapLoadedCallback")
            }
            return d.promise;
        }

    }

})
;