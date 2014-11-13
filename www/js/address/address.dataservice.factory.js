/**
 * Created by Alexander Sutyagin
 * http://interosite.ru
 * info@interosite.ru
 */
define([
    "angular"
], function (angular) {

        'use scrict';

        angular.module('dropbike.address').factory('addressDataService', addressDataService);

        addressDataService.$inject = ['$localStorage'];

        function addressDataService($localStorage) {

            return {
                getSearchHistory: getSearchHistory,
                addToSearchHistory: addToSearchHistory
            }

            function getSearchHistory() {
                return $localStorage.addressSearchHistory || [];
            }

            function addToSearchHistory(entry) {

                var items = getSearchHistory();

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (entry.address == item.address || (
                        (Math.abs(entry.lat - item.lat) < 0.0001) &&
                            (Math.abs(entry.lng - item.lng) < 0.0001)
                        )) {
                        return;
                    }
                }

                items.unshift(entry);

                if (items.length > 20) {
                    items.pop()
                }

                $localStorage.addressSearchHistory = items;
            }

        }

    }

)
;
