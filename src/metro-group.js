;(function (angular) {
    'use strict';

    angular.module('dvhbMetro').directive('metroStationGroup', metroStationGroup);


    /**
     * @directive metroStationGroup
     * 
     * @using
     * <g metro-station-group>
     *   <g metro-station-name="Курская (Кольцевая)">..</g>
     *   <g metro-station-name="Кусркая (Арбатско-Покровская)">..</g>
     * </g>
     */
    function metroStationGroup () {
        return {
            restrict: 'A',
            link: link,
            require: '^metro',
            controller: Controller,
            replace: false,
            scope: {}
        };

        function Controller ($scope, $element) {
            $scope.stations = {};
            $scope.main = "";


            this.registerStation = function (name, data) {
                $scope.stations[name] = data;
                $scope.main = name;
            };

        }

        function link (scope, element, attrs, metroMapCtrl) {
            var topOffset = element;

            function isDisabled () {
                var result = true;
                angular.forEach(scope.stations, function (value, key) {
                    if (value.isDisabled === false)
                        result = false;
                });
                return result;
            }

            scope.$watch(isDisabled, function (newValue) {
                var el = element[0];
                var isDisabled = /disabled/.test(el.className.baseVal);
                if (!isDisabled && newValue) {
                    el.className.baseVal = el.className.baseVal + ' disabled'; 
                }
                if (isDisabled && !newValue) {
                    el.className.baseVal = el.className.baseVal
                        .split(' ')
                        .filter(function (className) { return className != 'disabled'; })
                        .join(' ');
                }
            });

            element.find('text').bind('click', function (ev) {
                var names = [];
                if (isDisabled())
                    return;
                for (var o in scope.stations) {
                    if (!o.isDisabled)
                        names.push(o);
                }
                ev.originalEvent.data = {fromStation: true};
                var coords = ev.target.getBoundingClientRect();

                metroMapCtrl.onSelectStation(names, coords);

            });
        }
    }
})(angular);