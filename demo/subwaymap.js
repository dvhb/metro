angular.module('dvhbSubwayMap', []);


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
            element.on('click', function (ev) {
                if (!ev.originalEvent.data || !ev.originalEvent.data.fromStation) {
                    (scope.subwayInfo.hide || angular.noop)()
                }
            })
        }

    }

})(angular)
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
                    e.originalEvent.data = {fromStation: true};
                    console.log('station:', e);
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
/**
 * SubwayInfo
 *
 * @description
 * This directive is used for displaying information
 * about selected station 
 * 
 * @attributes
 *  - control (optional) -  object that will be extended with 
 *                          directives control api
 *
 * @using
 * <subway-map on-select="onSelect">
 *     <div subway-info>
 *         {{info}}
 *     </div>
 * </subway-map>
 *
 * $scope.onSelect = function (names, coords) {
 *     $scope.info = getStationInfo(names);
 * }
 */
;(function (angular) {
    'use strict';

    angular.module('dvhbSubwayMap').directive('subwayInfo', subwayInfo);

    function subwayInfo () {
        return {
            require: ['^subwayMap'],
            restrict: 'A',
            link: link,
            scope: {
                control: '=?',
                offset: '=?'
            }
        }

        function link (scope, element, attrs, ctrls) {

            var subwayMapCtrl = ctrls[0],
                api;

            api = {
                show: show,
                hide: hide,
                isOpen: isOpen
            }

            init();

            function extendObjWithApi (obj) {
                return angular.extend(obj, api);
            }

            /**
             * Shows directive at given position
             * 
             * @param  {Array<Number, Number>} position - position of info window
             */
            function show (position) {
                var left = position.left,
                    top = position.top;

                if (scope.offset && scope.offset.left)
                    left += scope.offset.left || 0;

                if (scope.offset && scope.offset.top)
                    top += scope.offset.top || 0;


                element.css('left', left + 'px');
                element.css('top', top + 'px');
                element.css('display', 'block');
            }

            /**
             * Hides direcitve
             */
            function hide () {
                element.css('display', 'none');
            }

            /**
             * Detects if info window is open
             */
            function isOpen () {
                return element.css('display') == 'block';
            }

            /**
             * Init css styles and extends objects with
             * directives api
             */
            function init () {
                element.css('position', 'absolute');
                hide();                
                subwayMapCtrl.setSubwayInfo(extendObjWithApi({}));

                if (scope.control)
                    extendObjWithApi(scope.control);
            }
        }
    }

})(angular);
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
                ev.originalEvent.fromStation = true;
                var coords = $(ev.target).position();

                subwayMapCtrl.onSelectStation(names, coords);

            });
        }
    }
})(angular);