/* flow */
ym.modules.define(
    'layout.svgIcon',
    [
        'templateLayoutFactory',
        'util.css',
        'Monitor',
        'layout.storage',
        'util.dom.style',
        'util.dom.element',
        'system.nextTick',
        'svgIcon.canvasBuilder',
        'svgIcon.pathCollection'
    ],
    function (provide: Function, templateLayoutFactory, utilCss, Monitor,
        layoutStorage, domStyle, domElement, nextTick, canvasBuilder, svgPathCollection) {

        var ICON_CLASS: string = utilCss.addPrefix('svg-icon'),
            LABEL_CLASS: string = utilCss.addPrefix('svg-label');

        var IconLayout = templateLayoutFactory.createClass(/* eslint one-var: 1 */
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

                    // We need to update icon offset,
                    // but could do that only after the layout (view in Overlay terms) is builded.
                    nextTick(this._onAfterBuild.bind(this));
                },

                _setupAll: function (): void {
                    this._canvas = canvasBuilder.build({
                        path: this.options.get('path', svgPathCollection.SQUARE_PIN),
                        fill: this.options.get('fill', '#555555'),
                        scale: this.options.get('scale', 1)
                    });

                    var defaultIconShape: Object = {
                        type: 'Rectangle',
                        coordinates: [
                            [0, 0],
                            [this._canvas.width, this._canvas.height]
                        ]
                    };

                    this.options.set({
                        shape: this.options.get('shape', defaultIconShape)
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
                    // base64 ver
                    // domStyle.css(
                    //     domElement.findByClassName(this.getElement(), ICON_CLASS),
                    //     {
                    //         width: this._canvas.width + 'px',
                    //         height: this._canvas.height + 'px',
                    //         background: 'url(' + this._canvas.toDataURL('image/png') + ')'
                    //     });
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
);
