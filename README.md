# Yandex Maps API svgIcon preset
svgIcon is an preset to show custom GeoObject markers based on user's SVG path string.

Loading
-------

1. Put module source code (`ymap-svg-icon.min.js`) on your CDN.

2. Load both [Yandex Maps JS API 2.1](https://tech.yandex.com/maps/doc/jsapi/2.1/dg/concepts/general-docpage/) and module source code by adding following code
```html
<script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU"></script>
<script src="ymap-svg-icon.min.js"></script>
```

3. Get access to module functions by using [ymaps.modules.require](https://tech.yandex.com/maps/doc/jsapi/2.1/ref/reference/modules.require-docpage/) method
```js
ymaps.modules.require(['svgIcon'], function () {

    var placemark = new ym.Placemark(
        map.getCenter(),
        null,
        {
            preset: 'custom#svgIcon',
            iconPath: 'M22-48h-44v43h16l6 5 6-5h16z'
        });

    map.geoObjects.add(placemark);
});
```

Params
----

| Parameter | Default value | Decription |
|---------|-----------------------|----------|
| `iconPath` | SQUARE_PIN | string describing SVG path |
| `iconPathFill` | #555555 | fill color |
| `iconLabel` | - | classname, if want to show icon inside marker (for example it might be icon classes from [FontAwesome](http://fortawesome.github.io/Font-Awesome/) or [Glyphicons](http://glyphicons.bootstrapcheatsheets.com/)) |
| `iconScale` | 1 | scale factor |

Predefined paths
----

To use require module `svgIcon.pathCollection`. Path names: `SHIELD, ROUTE, SQUARE_PIN, SQUARE, SQUARE_ROUNDED`

Demo
----

http://effrenus.github.io/ymap-svg-icons/

Examples
--------
* Displaying geoObjects with different icons
```js
ymaps.ready(function () {
    var myMap = new ymaps.Map('YMapsID', {
        center: [55.7517318022522, 37.61691485505143],
        zoom: 10
    });
    ymaps.modules.require(['svgIcon'], function () {
        var p1 = new ym.Placemark(
                map.getCenter(), null,
                {
                    preset: 'custom#svgIcon',
                    iconPath: 'M22-48h-44v43h16l6 5 6-5h16z'
                }),
            p2 = new ym.Placemark(
                map.getCenter(), null,
                {
                    preset: 'custom#svgIcon',
                    iconPath: 'M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z',
                    iconPathFill: '#AAAAAA',
                    iconLabel: 'fa fa-fort-awesome' // icon inside marker
                });

        myMap.geoObjects.add([p1, p2]);
    });
});
```

Building
--------
Use [ymb](https://www.npmjs.com/package/ymb) if re-build is needed.
