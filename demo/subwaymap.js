angular.module('dvhbSubwayMap', []);


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
            element.css('position', 'relative');

            element.on('click', function (ev) {
                if (!ev.originalEvent.fromStation)
                    (scope.subwayInfo.hide || angular.noop)()
            })
        }

    }

})(angular)
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
;(function (angular) {
    'use strict';

    angular.module('dvhbSubwayMap').directive('subwayInfo', subwayInfo);

    function subwayInfo () {
        return {
            require: ['^subwayMap'],
            restrict: 'A',
            link: link,
            scope: {
                control: '=?'
            }
        }

        function link (scope, element, attrs, ctrls) {

            var subwayMapCtrl = ctrls[0],
                api;

            api = {
                show: show,
                hide: hide
            }

            init();

            function extendObjWithApi (obj) {
                return angular.extend(obj, api);
            }

            function show (position) {
                element.css('display', 'block');
                element.css('left', position.left);
                element.css('top', position.top);
            }

            function hide () {
                element.css('display', 'none');
            }

            function init () {
                element.css('position', 'absolute');
                hide();                
                subwayMapCtrl.setSubwayInfo(extendObjWithApi({}, api));

                if (scope.control)
                    extendObjWithApi(scope.control);
            }
        }

        // subwayMap.on('info:show')
        // 
        // 
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