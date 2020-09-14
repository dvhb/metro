# Metro map

**@dvhb/metro** - is a library for displaying metro maps. It allows selecting stations on the map and showing information about them.

## Demo
http://dvhb.github.io/metro/

## Install with npm

```
npm i @dvhb/metro --save
```

## Requirements

- jquery
- angular >= 1.3

## Usage

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js"></script>
<script type="text/javascript" src="dvhb_metro.min.js"></script>
```

```html
<div metro  stations="stations" on-select="showInfo">
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
      "Курская (Кольцевая)": "SM. - Atrium, 3th fl., from 9:00 to 21:00",
      "Фили": "SM. - Filevsky, 1st fl., from 10:00 to 21:00",
      "Войковская": "SM. Voykovsky, 2nd fl., from 8:00 to 22:00",
      "Спартак": "SM. Kolizey, 1st fl., from 8:00 to 22:00"
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

## Directives

### SubwayMap


Attribute | Type | Description 
---------|-----|---------
stations | `Array<String> \| Object` | list of active (available for selection) stations. It can be in an array with station names or an object, where every key is a station name
on-select | `Function(names, coords)` | function that will be called when a station is selected 
map-url | `String` | link to svg with map

### MetroInfo

Pop-up window with information about the selected station

Attribute | Type | Description
---------|-----|-----------
offset|`{top: Number, left: Number}`| offset from station position


# Translations

Readme for **@dvhb/metro** is also available in other languages:

* :us: [English](./README.MD)
* :ru: [Russian](./README-RU.MD)



# License

[MIT License](./LICENSE) © [dvhb](http://dvhb.com/)

Design of metro map © Art. Lebedev Studio