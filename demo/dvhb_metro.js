angular.module('dvhbMetro', []);


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

    function Metro () {
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
                allNames;

            $scope.metroInfo = null;

            /**
             * List of avaible stations. If station not presented in
             * this list, it will be disabled
             */
            allNames = $element[0].querySelectorAll('[metro-station-name]');
            allNames = [].map.call(allNames, function (a) { return a.attributes['metro-station-name'].nodeValue; });
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

            /**
             * Initialization
             */
            function init () {
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
            function isExists (collection, key) {
                if (angular.isArray(collection)) {
                    return collection.indexOf(key) != -1;
                } 
                if (angular.isObject(collection)) {
                    return angular.isDefined(collection[key]);
                }
                return false;
            }

            $scope.$watch('stations', init, true);

        }

        function link (scope, element, attrs) {
            //dynamic inline styles for svg (issue #2, ie)
            if (!document.getElementById('dvhb_metro_style_inline')) {
                var svgCSS =
                    "metro:after{content:\"\";display:block;padding-bottom:120%}metro svg{position:absolute;left:0;top:0;width:100%}" +
                    "g.metro-station{cursor:pointer}g.metro-station.disabled{cursor:initial}g.metro-station.selected text,g.metro-station.selected tspan{font-weight:700!important}g.metro-station.disabled text,g.metro-station.disabled tspan{fill:gray;cursor:initial}g.metro-station text.style1{font-family:'PT Sans',sans-serif;font-weight:400;font-style:normal;font-stretch:normal;font-variant:normal;font-size:20px}g.metro-station.disabled .metro-point{display:none}.st0{fill:#676A6B}.st3,.st4,.st5,.st6{fill:none}.st1{font-family:'PT Sans'}.st2{font-size:16}.st3{stroke:#93CE99;stroke-width:4;stroke-miterlimit:10}.st4{stroke:#DDE482;stroke-width:4;stroke-miterlimit:10}.st5{stroke:#62BFF8;stroke-width:4;stroke-miterlimit:10}.st6{stroke:#FFDF80;stroke-width:8;stroke-miterlimit:10}.st7{fill:#FFDF80}.st8{font-size:13}.st9{fill:none;stroke:#ACBFE2;stroke-width:8;stroke-miterlimit:10}.st10{fill:#ACBFE3}.st11{fill:#FFF}.st12{fill:none;stroke:#CFE58F;stroke-width:8;stroke-miterlimit:10}.st13{fill:#CFE58F}.st14{fill:none;stroke:#FFDF80;stroke-width:8;stroke-miterlimit:10}.st15{fill:#FFDF80}.st16{fill:none;stroke:#FABE94;stroke-width:8;stroke-miterlimit:10}.st17{fill:#FABE94}.st18{fill:none;stroke:#D3D3D5;stroke-width:8;stroke-miterlimit:10}.st19{fill:#D3D3D5}.st20{fill:none;stroke:#D8AC9D;stroke-width:8;stroke-miterlimit:10}.st21{fill:#9C563E}.st22{fill:none;stroke:#95D59F;stroke-width:8;stroke-miterlimit:10}.st23{fill:#4CB85E}.st24{fill:none;stroke:#7ACCCD;stroke-width:8;stroke-miterlimit:10}.st25{fill:#79CDCD}.st26{fill:none;stroke:#62BFF8;stroke-width:8;stroke-miterlimit:10}.st27{fill:#0078BF}.st28{fill:none;stroke:#8FE7FF;stroke-width:8;stroke-miterlimit:10}.st29{fill:#8FE7FF}.st30{fill:none;stroke:#C28FCC;stroke-width:8;stroke-miterlimit:10}.st31{fill:#C28FCC}.st32{fill:none;stroke:#F58C84;stroke-width:8;stroke-miterlimit:10}.st33{fill:#ED2C26}.st34{fill:none;stroke:#62BFF8;stroke-width:4;stroke-miterlimit:10}.st35{fill:#62BFF8}.st36{font-size:8}.st37{fill:none;stroke:#FABE94;stroke-width:4;stroke-miterlimit:10}.st38{fill:#DDE482}.st39,.st40,.st41,.st42,.st43,.st45,.st46,.st47,.st48,.st49{fill:none}.st39{stroke:#FFE394;stroke-width:4;stroke-miterlimit:10}.st40{stroke:#E98B89;stroke-width:4;stroke-miterlimit:10}.st41{stroke:#95D59F;stroke-width:9;stroke-miterlimit:10}.st42{stroke:#B3D346;stroke-width:9;stroke-miterlimit:10}.st43{stroke:#FABE94;stroke-width:9;stroke-miterlimit:10}.st44{fill:none;stroke:#C28FCC;stroke-width:9;stroke-miterlimit:10}.st45{stroke:#D3D3D5;stroke-width:9;stroke-miterlimit:10}.st46{stroke:#D8AC9D;stroke-width:9;stroke-miterlimit:10}.st47{stroke:#ACBFE2;stroke-width:9;stroke-miterlimit:10}.st48{stroke:#FFCB36;stroke-width:9;stroke-miterlimit:10}.st49{stroke:#62BFF8;stroke-width:9;stroke-miterlimit:10}.st50{font-size:20}.st51{fill:#D8AC9D}.st52{fill:#F58C84}.st53,.st54,.st55,.st56{fill:none}.st53{stroke:#FFF;stroke-width:2.6;stroke-miterlimit:10}.st54{stroke:#D3D3D5;stroke-width:9;stroke-miterlimit:10}.st55{stroke:#8FE7FF;stroke-width:9;stroke-miterlimit:10}.st56{stroke:#F58C84;stroke-width:9;stroke-miterlimit:10}.st57{fill:#95D59F}.st58{fill:#8FE7FF}.st59{fill:#FFDF80}.st60{fill:none;stroke:#4DB85D;stroke-width:9;stroke-miterlimit:10}.st61{fill:#F58C84}.st62{fill:#D3D3D5}.st63{fill:none;stroke:#8FE7FF;stroke-width:9;stroke-miterlimit:10}.st64{fill:none;stroke:#62BFF8;stroke-width:9;stroke-miterlimit:10}.st65{fill:#D3D3D5}.st66{fill:#FABE94}.st67{fill:none;stroke:#FFCB32;stroke-width:9;stroke-miterlimit:10}.anch-end{text-anchor:end}.anch-middle{text-anchor:middle}";
                var style = document.createElement('style');
                style.id = 'dvhb_metro_style_inline';
                style.type = 'text/css';
                style.innerHTML = svgCSS;
                document.getElementsByTagName('head')[0].appendChild(style);
            }

            element.on('click', function (ev) {
                if (!ev.originalEvent.data || !ev.originalEvent.data.fromStation) {
                    ((scope.metroInfo && scope.metroInfo.hide) || angular.noop)();
                }
            });
        }

    }

})(angular);
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

    angular.module('dvhbMetro').directive('metroStationName', metroStationName);
    
    function metroStationName () {
        return {
            require: ['?^metroStationGroup', '^metro'],
            restrict: 'A',
            link: link,
            scope: {}
        };


        function link (scope, element, attrs, ctrls) {

            var metroCtrl = ctrls[1],
                metroStationGroup = ctrls[0],
                name, coords;


            init();

            function getCircleCoords () {
                var circles = element.find('circle'),
                    main, body, rect;
                for (var i = circles.length - 1; i >= 0; i--) {
                    if ((' ' + circles[i].className.baseVal + ' ').indexOf(' metro-point ') > -1) {
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
                    metroCtrl.onSelectStation([name], getCircleCoords());
                }
                if (!scope.data.isDisabled && metroCtrl.multiple) {
                    scope.data.isActive = !scope.data.isActive;
                }
            }

            function init () {
                name = attrs.metroStationName;
                element.bind('click', toggle);
            
                var data = metroCtrl.findStation(name);
                if (data) {
                    scope.data = data; 

                    if (metroStationGroup) {
                        metroStationGroup.registerStation(name, data);
                    }

                    scope.$watch('data.isDisabled', function (newValue) {
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
                }
            }
        }
    }
})(angular);
/**
 * metroInfo
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
 * <metro on-select="onSelect">
 *     <div metro-info>
 *         {{info}}
 *     </div>
 * </metro>
 *
 * $scope.onSelect = function (names, coords) {
 *     $scope.info = getStationInfo(names);
 * }
 */
;(function (angular) {
    'use strict';

    angular.module('dvhbMetro').directive('metroInfo', metroInfo);

    function metroInfo () {
        return {
            require: ['^metro'],
            restrict: 'A',
            link: link,
            scope: {
                control: '=?',
                offset: '=?'
            }
        };

        function link (scope, element, attrs, ctrls) {

            var metriCtrl = ctrls[0],
                api;

            api = {
                show: show,
                hide: hide,
                isOpen: isOpen
            };

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
                metriCtrl.setMetroInfo(extendObjWithApi({}));

                if (scope.control)
                    extendObjWithApi(scope.control);
            }
        }
    }

})(angular);
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