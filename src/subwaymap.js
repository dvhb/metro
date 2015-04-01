;(function (angular) {
    'use strict'

    angular.module('dvhbSubwayMap', []);

    angular.module('dvhbSubwayMap').directive('subwayMap', subwayMap);
    angular.module('dvhbSubwayMap').directive('subwayStationName', subwayStationName);
    angular.module('dvhbSubwayMap').directive('subwayStationGroup', subwayStationGroup);

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
                disabledStations: '=?',
                enabledStations: '=?',
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
                $scope.disabledStations = angular.isDefined($scope.disabledStations) ? $scope.disabledStations : [];

                // populating stations dictionary with data
                angular.forEach(allNames, function (value, key) {
                    var isEnabledDefined = angular.isDefined($scope.enabledStations); 
                    all[value] = {
                        isActive: false, 
                        isDisabled: isEnabledDefined 
                            ? $scope.enabledStations.indexOf(value) == -1
                            : $scope.disabledStations.indexOf(value) != -1
                    };
                });
            }

        }

        function link (scope, element, attrs) {
            element.css('position', 'relative')
        }

    }


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
                    subwayMapCtrl.onSelectStation([name], getCircleCoords());
                }
                if (!scope.data.isDisabled && subwayMapCtrl.multiple) {
                    scope.data.isActive = !scope.data.isActive;
                }
            }

        }
    }


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
                element.toggleClass('disabled', newVal);
            });

            element.find('text').bind('click', function (ev) {
                var names = [];
                if (isDisabled())
                    return;
                for (var o in scope.stations) {
                    if (!o.isDisabled)
                        names.push(o);
                }

                var coords = $(ev.target).position();

                subwayMapCtrl.onSelectStation(names, coords);

            });
        }
    }



})(angular);