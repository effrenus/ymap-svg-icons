ym.modules.define(
    'svg.layout',
    [
        'templateLayoutFactory',
        'util.css',
        'Monitor',
        'layout.storage',
        'util.dom.style',
        'util.dom.element',
        'svg.canvasBuilder',
        'svg.pathCollection'
    ],
    function (provide, templateLayoutFactory, utilCss, Monitor,
        layoutStorage, domStyle, domElement, canvasBuilder, svgPathCollection) {

        var ICON_CLASS = utilCss.addPrefix('svg-icon'),
            LABEL_CLASS = utilCss.addPrefix('svg-label');

        var IconLayout = templateLayoutFactory.createClass(
            [
                '<ymaps class=' + ICON_CLASS + ' style="display: block">',
                    '<i class="' + LABEL_CLASS + '"></i>',
                '</ymaps>'
            ].join(''),
            {
                build: function () {
                    IconLayout.superclass.build.call(this);

                    // this.monitor = new Monitor(this.getData().options);
                    // this.monitor.add('canvas', this._onCanvasChanged, this);
                    this.options = this.getData().options;

                    domStyle.css(this.getElement(), {
                        position: 'absolute'
                    });

                    canvasBuilder
                        .build({
                            path: this.options.get('path', svgPathCollection.SQUARE_PIN),
                            fill: this.options.get('fill', '#555555')
                        })
                        .then(this._onCanvasChanged.bind(this));
                },

                _onCanvasChanged: function (canvas) {
                    console.log(canvas)
                    var shape = {
                        type: 'Rectangle',
                        coordinates: [
                            [0, 0],
                            [canvas.width, canvas.height]
                        ]
                    };

                    this.options.set({
                        canvas: canvas,
                        shape: this.options.get('shape', shape)
                    });

                    this.options.getParent().set('offset', [-canvas.width / 2, -canvas.height]);

                    this._setupCanvas();
                    this._setupIcon();

                    this.events.fire('shapechange');
                },

                _setupIcon: function () {
                    this._setupLabel();
                },

                _setupLabel: function () {
                    var labelElement = domElement.findByClassName(this.getElement(), LABEL_CLASS);
                    domStyle.css(labelElement, {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        textAlign: 'center'
                    });
                    labelElement.className += ' ' + this.getData().options.get('label', '');
                },

                _setupCanvas: function () {
                    var canvas = this.getData().options.get('canvas');

                    if (!canvas) {
                        this._removeCanvas();
                        return;
                    }

                    if (canvas != this._canvas) {
                        this._removeCanvas();
                        this._canvas = canvas;
                        domElement
                            .findByClassName(this.getElement(), ICON_CLASS)
                            .appendChild(this._canvas);
                    }
                },

                _removeCanvas: function () {
                    this._canvas && this._canvas.remove();
                    this._canvas = null;
                }
            }
        );

        layoutStorage.add('svg#iconLayout', IconLayout);

        provide(IconLayout);

    }
)
