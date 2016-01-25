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
                        position: 'absolute',
                        visibility: 'hidden'
                    });

                    this._setupAll();

                    // We need update icon offset, but could do that only after layout is builded
                    window.setTimeout(this._onAfterBuild.bind(this), 0);
                },

                _setupAll: function (): void {
                    this._canvas = canvasBuilder.build({
                        path: this.options.get('path', svgPathCollection.SQUARE_PIN),
                        fill: this.options.get('fill', '#555555'),
                        scale: this.options.get('scale', 1),
                    });

                    var shape: Object = {
                            type: 'Rectangle',
                            coordinates: [
                                [0, 0],
                                [this._canvas.width, this._canvas.height]
                            ]
                        };

                    this.options.set({
                        shape: this.options.get('shape', shape)
                    });

                    this._setupCanvas();
                    this._setupLabel();
                },

                _setupLabel: function (): void {
                    var labelElement = domElement.findByClassName(this.getElement(), LABEL_CLASS);
                    domStyle.css(labelElement, {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        textAlign: 'center',
                        lineHeight: this._canvas.height + 'px'
                    });
                    labelElement.className += ' ' + this.getData().options.get('label', '');
                },

                _setupCanvas: function (): void {
                    domElement
                        .findByClassName(this.getElement(), ICON_CLASS)
                        .appendChild(this._canvas);
                },

                _onAfterBuild: function () {
                    var canvas: HTMLCanvasElement = this._canvas;

                    this.options.getParent().set('offset', [-canvas.width / 2, -canvas.height]);
                    domStyle.css(this.getElement(), {
                        visibility: 'visible'
                    });
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
