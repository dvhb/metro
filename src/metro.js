/**
 * Metro
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
 * <metro stations="stations" on-select="onSelect">
 * </metro>
 */
;(function (angular) {
    'use strict';

    angular.module('dvhbMetro').directive('metro', Metro);

    function Metro($compile) {
        return {
            restrict: 'AE',
            replace: false,
            transclude: true,
            controller: Controller,
            controllerAs: 'metro',
            link: link,
            templateUrl: function (elem, attrs) {
                return attrs.mapUrl || './metro.svg';
            },
            scope: {
                stations: '=?',
                onSelect: '=?'
            }
        };

        function Controller($scope, $element, $q) {
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
                allNames;

            $scope.metroInfo = null;

            prepareSVG();

            /**
             * List of avaible stations. If station not presented in
             * this list, it will be disabled
             */
            allNames = $element[0].querySelectorAll('[metro-station-name]');
            allNames = [].map.call(allNames, function (a) {
                return a.attributes['metro-station-name'].nodeValue;
            });
            init();

            vm.setMetroInfo = function (metroInfo) {
                $scope.metroInfo = metroInfo;
            };

            /**
             * Calls user defined callback and metroInfo.show
             * if metroInfo exists
             *
             * @param {Array<String>} - list of selected stations
             * @param {Array<Number>} - position of object
             */
            vm.onSelectStation = function (names, coords) {
                var mapRect = $element[0].getBoundingClientRect();
                coords = {left: coords.left - mapRect.left, top: coords.top - mapRect.top};

                (($scope.metroInfo && $scope.metroInfo.show) || angular.noop)(coords);
                ($scope.onSelect || angular.noop)(names, coords);
            };

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
                    return {};
            };

            $scope.$watch('stations', init, true);
            compileSVG();

            /**
             * Initialization
             */
            function init() {
                defer.resolve();

                // populating stations dictionary with data
                angular.forEach(allNames, function (value, key) {
                    all[value] = all[value] || {};
                    all[value].isDisabled = $scope.stations ? !isExists($scope.stations, value) : true;
                });
            }

            /**
             * Checks if station exists in collection
             *
             * @param  {Array|Object} collection - stations
             * @param  {String} key - name of the station
             * @return {Boolean}
             */
            function isExists(collection, key) {
                if (angular.isArray(collection)) {
                    return collection.indexOf(key) != -1;
                }
                if (angular.isObject(collection)) {
                    return angular.isDefined(collection[key]);
                }
                return false;
            }

            /**
             * Prepare SVG for use dynamic `metro-station-group`, `metro-station` directives
             */
            function prepareSVG() {
                var $stations = $($element).find('[id^="s"]');
                $stations.each(function () {
                    var $s = $(this),
                        $circle = $s.find('circle:last'),
                        name = $s.find('text:last').text();

                    $s
                        .attr('class', 'metro-station')
                        .attr('metro-station-name', name);

                    $circle
                        .attr('class', $circle.attr('class') + ' metro-point');

                });

                var $stationsGroups = $($element).find('[id^="g"]');
                $stationsGroups.each(function () {
                    var $stationGroup = $(this);
                    $stationGroup
                        .attr('class', 'metro-station')
                        .attr('metro-station-group', '');
                });
            }

            /**
             * Recompile template for use dynamic `metro-station-group`, `metro-station` directives
             */
            function compileSVG() {
                $compile($element[0].querySelectorAll('svg'))($scope);
            }
        }

        function link(scope, element) {
            //insert styles for svg
            var svgCSS =
                "@import url('//fonts.googleapis.com/css?family=PT+Sans&subset=cyrillic');" +
                "metro:after{content:\"\";display:block;padding-bottom:120%}metro svg{position:absolute;left:0;top:0;width:100%}" +
                "g.metro-station{cursor:pointer}g.metro-station.disabled{cursor:initial}g.metro-station.selected text,g.metro-station.selected tspan{font-weight:700!important}g.metro-station.disabled text,g.metro-station.disabled tspan{fill:gray;cursor:initial}g.metro-station text.style1{font-family:'PT Sans','sans-serif';font-weight:400;font-style:normal;font-stretch:normal;font-variant:normal;font-size:20px}g.metro-station.disabled .metro-point{display:none}";

            var style = document.createElement('style');
            style.id = 'dvhb_metro_style_inline';
            style.type = 'text/css';
            style.innerHTML = svgCSS;
            document.getElementsByTagName('head')[0].appendChild(style);

            element.on('click', function (ev) {
                if (!ev.originalEvent.data || !ev.originalEvent.data.fromStation) {
                    ((scope.metroInfo && scope.metroInfo.hide) || angular.noop)();
                }
            });
        }

    }

})(angular);