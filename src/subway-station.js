/**
 * SubwayStation
 *
 * @description
 * USED INSIDE SVG
 * This directives marks a station
 *
 * @using
 * <g subway-station-name="Войковская">...</g>
 */
;(function (angular) {
    'use strict'

    angular.module('dvhbSubwayMap').directive('subwayStationName', subwayStationName);
    
    function subwayStationName () {
        return {
            require: ['?^subwayStationGroup', '^subwayMap'],
            restrict: 'A',
            link: link,
            scope: {}
        }


        function link (scope, element, attrs, ctrls) {

            var subwayMapCtrl = ctrls[1],
                subwayStationGroup = ctrls[0],
                name, coords;


            init();

            function getCircleCoords () {
                var circles = element.find('circle'),
                    main, body, rect;
                for (var i = circles.length - 1; i >= 0; i--) {
                    if (circles[i].classList.contains('subway-point')) {
                        main = circles[i];
                        rect = main.getBoundingClientRect();
                        break;
                    }                        
                };
                return rect ? {left: rect.left, top: rect.top + window.scrollY} : null;
            }

            function toggle (e) {
                if (!scope.data.isDisabled) {
                    e.fromStation = true;
                    subwayMapCtrl.onSelectStation([name], getCircleCoords());
                }
                if (!scope.data.isDisabled && subwayMapCtrl.multiple) {
                    scope.data.isActive = !scope.data.isActive;
                }
            }

            function init () {
                name = attrs.subwayStationName;
                element.bind('click', toggle);
            
                var data = subwayMapCtrl.findStation(name);
                if (data) {
                    scope.data = data; 

                    if (subwayStationGroup) {
                        subwayStationGroup.registerStation(name, data);
                    }

                    scope.$watch('data.isDisabled', function (newValue) {
                        element[0].classList.toggle('disabled', newValue);
                    });
                }
            }
        }
    }
})(angular)