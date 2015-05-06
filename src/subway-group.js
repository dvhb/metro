;(function (angular) {
    'use strict'

    angular.module('dvhbSubwayMap').directive('subwayStationGroup', subwayStationGroup);


    /**
     * @directive subwayStationGroup
     * 
     * @using
     * <g subway-station-group>
     *   <g subway-station-name="Курская (Кольцевая)">..</g>
     *   <g subway-station-name="Кусркая (Арбатско-Покровская)">..</g>
     * </g>
     */
    function subwayStationGroup () {
        return {
            restrict: 'A',
            link: link,
            require: '^subwayMap',
            controller: Controller,
            replace: false,
            scope: {}
        }

        function Controller ($scope, $element) {
            $scope.stations = {};
            $scope.main = "";


            this.registerStation = function (name, data) {
                $scope.stations[name] = data;
                $scope.main = name;
            }

        }

        function link (scope, element, attrs, subwayMapCtrl) {
            var topOffset = element;

            function isDisabled () {
                var result = true;
                angular.forEach(scope.stations, function (value, key) {
                    if (value.isDisabled === false)
                        result = false;
                })
                return result;
            }

            scope.$watch(isDisabled, function (newVal) {
                element[0].classList.toggle('disabled', newVal);
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
                var coords = $(ev.target).position();

                subwayMapCtrl.onSelectStation(names, coords);

            });
        }
    }
})(angular);