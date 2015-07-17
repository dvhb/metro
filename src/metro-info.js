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
 * <metro-map on-select="onSelect">
 *     <div metro-info>
 *         {{info}}
 *     </div>
 * </metro-map>
 *
 * $scope.onSelect = function (names, coords) {
 *     $scope.info = getStationInfo(names);
 * }
 */
;(function (angular) {
    'use strict';

    angular.module('dvhbMetroMap').directive('metroInfo', metroInfo);

    function metroInfo () {
        return {
            require: ['^metroMap'],
            restrict: 'A',
            link: link,
            scope: {
                control: '=?',
                offset: '=?'
            }
        };

        function link (scope, element, attrs, ctrls) {

            var metroMapCtrl = ctrls[0],
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
                metroMapCtrl.setMetroInfo(extendObjWithApi({}));

                if (scope.control)
                    extendObjWithApi(scope.control);
            }
        }
    }

})(angular);