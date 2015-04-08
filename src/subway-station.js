;(function (angular) {
    'use strict'

    angular.module('dvhbSubwayMap').directive('subwayStationName', subwayStationName);
    
    /**
     * Subway station directive
     *
     * @using
     * <g subway-station-name="Войковская">...</g>
     */
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
                        element.toggleClass('disabled', newValue);
                    });
                }
            }

            function getCircleCoords () {
                var circles = element.find('circle'),
                    main, body, rect;
                for (var i = circles.length - 1; i >= 0; i--) {
                    if (circles.eq(i).hasClass('subway-point')) {
                        main = circles[i];
                        rect = main.getBoundingClientRect();
                        break;
                    }                        
                };
                
                return rect ? $(main).position() : null;
            }

            function toggle (e) {
                if (!scope.data.isDisabled) {
                    e.originalEvent.fromStation = true;
                    subwayMapCtrl.onSelectStation([name], getCircleCoords());
                }
                if (!scope.data.isDisabled && subwayMapCtrl.multiple) {
                    scope.data.isActive = !scope.data.isActive;
                }
            }

        }
    }
})(angular)