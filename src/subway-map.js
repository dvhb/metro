;(function (angular) {
    'use strict'

    angular.module('dvhbSubwayMap').directive('subwayMap', subwayMap);

    /**
     * Subway map directive
     *
     * @using
     * <subway-map enabled-stations="['Маяковская', 'Водный стадион']" map-url="/map.svg"></subway-map>
     */
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

            /**
             * List of avaible stations. If station not presented in
             * this list, it will be disabled
             */
            allNames = $element[0].querySelectorAll('[subway-station-name]');
            allNames = [].map.call(allNames, function (a) { return a.attributes['subway-station-name'].nodeValue })

            init();

            /**
             * Calls user defined callback `onSelect`
             * 
             * @param {Array<String>} - list of selected stations
             * @param {Array<Number>} - position of object
             */
            vm.onSelectStation = function (names, coords) {
                $scope.onSelect(names, coords);
            }

            vm.findStation = findStation;

            /**
             * Finds a station by it's id
             * 
             * @param  {String} name - station's name
             * @return {Object} - station data
             */
            function findStation (name) {
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
            element.css('position', 'relative')
        }

    }

})(angular)