ym.modules.define(
    'svg.Placemark',
    [
        'Placemark',
        'svg.canvasBuilder',
        'svg.pathCollection',
        'util.defineClass',
        'util.extend',

        'svg.layout'
    ],
    function (provide, Placemark, canvasBuilder, svgPathCollection, defineClass, extend) {

        var extendOptions = {
            iconLayout: 'svg#iconLayout'
        };

        function PlacemarkSVG(geometry, properties, options) {
            PlacemarkSVG.superclass.constructor.call(this, geometry, properties, extend({}, options, extendOptions));

            canvasBuilder
                .build({
                    path: this.options.get('iconPath', svgPathCollection.SQUARE_PIN),
                    fill: this.options.get('iconFill', '#555555')
                })
                .then(this._onCanvasBuild.bind(this));
        }

        defineClass(PlacemarkSVG, Placemark, {
            _onCanvasBuild: function (canvas) {
                var shape = {
                    type: 'Rectangle',
                    coordinates: [
                        [0, 0],
                        [canvas.width, canvas.height]
                    ]
                };

                this.options.set({
                    iconOffset: this.options.get('offset', [-canvas.width / 2, -canvas.height]),
                    iconCanvas: canvas,
                    iconShape: this.options.get('shape', shape)
                });
            }
        });

        provide(PlacemarkSVG);
    }
);
