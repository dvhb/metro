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