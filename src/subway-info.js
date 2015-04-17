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
                hide: hide
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
             * Init css styles and extends objects with
             * directives api
             */
            function init () {
                element.css('position', 'absolute');
                hide();                
                subwayMapCtrl.setSubwayInfo(extendObjWithApi({}, api));

                if (scope.control)
                    extendObjWithApi(scope.control);
            }
        }
    }

})(angular);