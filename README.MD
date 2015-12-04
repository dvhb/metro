# Схема Московского метрополитена

**dvhbMetro** - директива схемы метро для Angular.js. Позволяет выбирать станции на карте и отображать информацию о них.

## Установка через bower

```
bower install dvhb-metro
```

## Требования

- jquery
- angular >1.2
- шрифт PT Sans для текста на карте

## Использование

```html
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="angular.min.js"></script>
<script type="text/javascript" src="dvhb_metro.min.js"></script>
<link href='http://fonts.googleapis.com/css?family=PT+Sans' rel='stylesheet' type='text/css'>
```
```html
<div metro 
  stations="stations" 
  on-select="showInfo" 
  map-url="./bower_components/dvhb_metro/lib/metro.svg">
  <div metro-info offset="{top: 20}">
    <b>{{station.name}}</b>
    <i>{{station.info}}</i>
  </div>
</div>
```

```js
angular
  .module('App', ['dvhbMetro'])
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
stations | `Array<String> | Object` | список активных (доступных для выбора) станций. Может быть массивом с именами станций или объектом, где каждый ключ является названием станции
on-select | `Function(names, coords)` | функция, которая будет вызвана при выборе станции. 
map-url | `String` | ссылка на svg с картой

### MetroInfo

Всплывающее окно с информацией о выбранной станции

Аттрибут | Тип | Описание
---------|-----|-----------
offset|`{top: Number, left: Number}`| отступ от позиции станции

# Лицензия

[MIT License](./LICENSE) © [dvhb](http://dvhb.ru/)

Дизайн карты метро © Студия Артемия Лебедева