/**
 * SubwayMap
 *
 * @description
 * This directives draws a metro map
 *
 * @attributes
 *  - stations (optional) - list of active stations
 *                          can be array of strings with names
 *                          of stations or can be an object where
 *                          every key is station name
 *  - onSelect (option) -   callback that called when user selects
 *                          a station from the stations list
 *
 * @using
 * <subway-map stations="stations" on-select="onSelect">
 * </subway-map>
 * 
 */
;(function (angular) {
    'use strict'

    angular.module('dvhbSubwayMap').directive('subwayMap', subwayMap);

    function subwayMap () {
        return {
            restrict: 'AE',
            replace: false,
            transclude: true,
            controller: Controller,
            controllerAs: 'subwayMap',
            link: link,
            templateUrl: function (elem, attrs) {
                return attrs.mapUrl || './metro.svg'
            },
            scope: {
                stations: '=?',
                onSelect: '=?'
            }
        }

        function Controller ($scope, $http, $element, $attrs, $q) {
            var defer = $q.defer(),
                // view model
                vm = this,
                // list of all stations with
                // their options
                // 
                // Example:
                // {
                //   'StationName': {
                //      isActive: false,
                //      isDisabled: false
                //   }
                // }
                all = {},
                allNames,
                defer;

            $scope.subwayInfo = null;

            /**
             * List of avaible stations. If station not presented in
             * this list, it will be disabled
             */
            allNames = $element[0].querySelectorAll('[subway-station-name]');
            allNames = [].map.call(allNames, function (a) { return a.attributes['subway-station-name'].nodeValue })
            init();

            vm.setSubwayInfo = function (subwayInfo) {
                $scope.subwayInfo = subwayInfo;
            }

            /**
             * Calls user defined callback and subwayInfo.show
             * if subwayInfo exists
             * 
             * @param {Array<String>} - list of selected stations
             * @param {Array<Number>} - position of object
             */
            vm.onSelectStation = function (names, coords) {
                var mapRect = $element[0].getBoundingClientRect();
                coords = {left: coords.left - mapRect.left, top: coords.top - mapRect.top};

                ($scope.subwayInfo.show || angular.noop)(coords);
                ($scope.onSelect || angular.noop)(names, coords);
            }

            /**
             * Finds a station by it's id
             * 
             * @param  {String} name - station's name
             * @return {Object} - station data
             */
            vm.findStation = function (name) {
                var data = all[name];

                if (angular.isDefined(data))
                    return data;
                else
                    return {}
            }

            /**
             * Initialization
             */
            function init () {
                defer.resolve();

                // populating stations dictionary with data
                angular.forEach(allNames, function (value, key) {
                    all[value] = all[value] || {};
                    all[value].isDisabled = $scope.stations ? !isExists($scope.stations, value) : true
                });
            }

            /**
             * Checks if station exists in collection
             * 
             * @param  {Array|Object} collection - stations
             * @param  {String} key - name of the station
             * @return {Boolean} 
             */
            function isExists (collection, key) {
                if (angular.isArray(collection)) {
                    return collection.indexOf(key) != -1
                } 
                if (angular.isObject(collection)) {
                    return angular.isDefined(collection[key])
                }
                return false
            }

            $scope.$watch('stations', init, true);

        }

        function link (scope, element, attrs) {
            element.css('position', 'relative');
            element.on('click', function (ev) {
                if (!ev.originalEvent.data || !ev.originalEvent.data.fromStation) {
                    (scope.subwayInfo.hide || angular.noop)()
                }
            })
        }

    }

})(angular)