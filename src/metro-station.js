/**
 * MetroStation
 *
 * @description
 * USED INSIDE SVG
 * This directives marks a station
 *
 * @using
 * <g metro-station-name="Войковская">...</g>
 */
;(function (angular) {
    'use strict';

    angular.module('dvhbMetroMap').directive('metroStationName', metroStationName);
    
    function metroStationName () {
        return {
            require: ['?^metroStationGroup', '^metroMap'],
            restrict: 'A',
            link: link,
            scope: {}
        };


        function link (scope, element, attrs, ctrls) {

            var metroMapCtrl = ctrls[1],
                metroStationGroup = ctrls[0],
                name, coords;


            init();

            function getCircleCoords () {
                var circles = element.find('circle'),
                    main, body, rect;
                for (var i = circles.length - 1; i >= 0; i--) {
                    if (circles[i].classList.contains('metro-point')) {
                        main = circles[i];
                        rect = main.getBoundingClientRect();
                        break;
                    }                        
                }
                return rect ? {left: rect.left, top: rect.top} : null;
            }

            function toggle (e) {
                if (!scope.data.isDisabled) {
                    e.originalEvent.data = {fromStation: true};
                    metroMapCtrl.onSelectStation([name], getCircleCoords());
                }
                if (!scope.data.isDisabled && metroMapCtrl.multiple) {
                    scope.data.isActive = !scope.data.isActive;
                }
            }

            function init () {
                name = attrs.metroStationName;
                element.bind('click', toggle);
            
                var data = metroMapCtrl.findStation(name);
                if (data) {
                    scope.data = data; 

                    if (metroStationGroup) {
                        metroStationGroup.registerStation(name, data);
                    }

                    scope.$watch('data.isDisabled', function (newValue) {
                        element[0].classList.toggle('disabled', newValue);
                    });
                }
            }
        }
    }
})(angular);