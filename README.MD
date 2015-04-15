# Схема Московского метрополитена

## Использование
```html
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="angular.min.js"></script>
<script type="text/javascript" src="subwaymap.js"></script>
<script type="text/javascript" src="jquery.svg.min.js"></script>
<script type="text/javascript" src="jquery.svgdom.min.js"></script>
<link href='http://fonts.googleapis.com/css?family=PT+Sans' rel='stylesheet' type='text/css'>
```
```html
<subway-map 
  stations="stations" 
  on-select="showInfo" 
  map-url="./bower_components/dvhb_sbuwaymap/lib/metro.svg">
  <div subway-info offset="{top: 20}">
    <b>{{station.name}}</b>
    <i>{{station.info}}</i>
  </div>
</subway-map>
```
```js
angular
  .module('App', ['dvhbSubwayMap'])
  .controller('MainCtrl', function ($scope) {
    $scope.stations = {
      "Курская (Кольцевая)": "ТЦ Атриум, 3 эт., с 9:00 до 21:00",
      "Фили": "ТЦ Филёвский, 1 эт., с 10:00 до 21:00",
      "Войковская": "ТЦ Войковский, 2 эт., с 8:00 до 22:00",
        "Спартак": "ТЦ Коллизей, 1 эт., с 8:00 до 22:00"
    };
  
    $scope.station = {};

    $scope.showInfo = function (names, position) {
      $scope.station = {
        name: names[0], 
        info: $scope.stations[names[0]]
      };
    }
  })
```

## Директивы

### SubwayMap


Аттрибут | Тип | Описание 
---------|-----|---------
stations | `Array<String> \| Object` | список активных (доступных для выбора) станций. Может быть массивом с именами станций или объектом, где каждый ключ является названием станции
on-select | `Function(names, coords)` | ссылка на метод, который будет вызван при выборе станции. 
map-url | `String` | ссылка на svg с картой

### SubwayInfo
Аттрибут | Тип | Описание
---------|-----|-----------
offset|`{top: Number, left: Number}`| отступ от позиции станции