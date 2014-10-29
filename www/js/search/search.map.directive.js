/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

    'use strict';

    angular.module('dropbike.search').directive('dropbikeMap', dropbikeMapDirective);

    dropbikeMapDirective.$inject = ['$q', '$window', '$rootScope', 'dropbikeUtil'];

    function dropbikeMapDirective($q, $window, $rootScope, dropbikeUtil) {

        return {
            restrict: 'E',
            scope: {
                apiKey: '=',
                markers: '=',
                location: '=',
                zoom: '=',
                locationIcon: '@',
                markerDefaultIcon: '@'
            },
            template: '<div class="dropbike-map-container"></div>',
            link: function (scope, element, attrs) {

                var _mapContainer = element.children()[0],
                    _map = null,
                    _currentLocation = null,
                    _currentLocationMarker = null,
                    _markers = null;


                mapApiReady(scope.apiKey)
                    .then(function () {
                        init();
                    });


                function init() {

                    var mapOptions = {
                        center: new google.maps.LatLng(scope.location[0], scope.location[1]),
                        zoom: scope.zoom || 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    _map = new google.maps.Map(_mapContainer, mapOptions);

                    scope.$watch('markers', function (markers) {
                        if (_markers && _markers.length) {
                            for (var i = 0; i < _markers.length; i++) {
                                _markers[i].setMap(null);
                            }
                        }
                        _markers = [];
                        if (markers && markers.length) {
                            for (var i = 0; i < markers.length; i++) {
                                if (markers[i] && markers[i].length) {
                                    var location = markers[i];
                                    _markers.push(addMarker(location[0], location[1], scope.markerDefaultIcon));
                                }
                            }
                        }
                    });

                    scope.$watch('location', function (location) {
                        if (location && location.length) {
                            if (_currentLocationMarker) {
                                _currentLocationMarker.setMap(null)
                            }
                            _currentLocation = addMarker(location[0], location[1], scope.locationIcon).getPosition();

                            _map.panTo(_currentLocation);
                            _map.setZoom(scope.zoom || 8);

                        }
                    });

                }

                function addMarker(lat, lng, icon) {
                    var location = new google.maps.LatLng(lat, lng);
                    return new google.maps.Marker({
                        position: location,
                        map: _map,
                        icon: icon || null
                    });
                }

                function checkMapLoaded() {
                    return $window['google'] && $window['google']['maps']
                        && $window['google']['maps']['Map']
                }

                function mapApiReady(apiKey) {
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
                            + apiKey
                            + "&sensor=false&&callback=dropbykeMapLoadedCallback")
                    }
                    return d.promise;
                }

            }

        };

    }

});
