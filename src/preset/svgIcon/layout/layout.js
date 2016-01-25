/* flow */
ym.modules.define(
    'svgIcon.layout',
    [
        'templateLayoutFactory',
        'util.css',
        'Monitor',
        'layout.storage',
        'util.dom.style',
        'util.dom.element',
        'svgIcon.canvasBuilder',
        'svgIcon.pathCollection'
    ],
    function (provide: Function, templateLayoutFactory, utilCss, Monitor,
        layoutStorage, domStyle, domElement, canvasBuilder, svgPathCollection) {

        var ICON_CLASS: string = utilCss.addPrefix('svg-icon'),
            LABEL_CLASS: string = utilCss.addPrefix('svg-label');

        var IconLayout = templateLayoutFactory.createClass(
            [
                '<ymaps class=' + ICON_CLASS + ' style="display: block">',
                    '<i class="' + LABEL_CLASS + '"></i>',
                '</ymaps>'
            ].join(''),
            {
                build: function (): void {
                    IconLayout.superclass.build.call(this);

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

                _onCanvasChanged: function (canvas: HTMLCanvasElement): void {
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
                    this._setupLabel();

                    this.events.fire('shapechange');
                },

                _setupLabel: function (): void {
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

                _setupCanvas: function (): void {
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

                _removeCanvas: function (): void {
                    this._canvas && this._canvas.remove();
                    this._canvas = null;
                }
            }
        );

        layoutStorage.add('svg#iconLayout', IconLayout);

        provide(IconLayout);

    }
)