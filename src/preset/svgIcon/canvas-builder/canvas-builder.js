/* flow */
ym.modules.define(
    'svg.canvasBuilder',
    [
        'util.dom.element',
        'util.dom.style',
        'vow'
    ],
    function (provide: Function, domElement: Object, domStyle: Object, vow: Object) {

        var NS = 'http://www.w3.org/2000/svg';

        /**
         * Draw SVG on Canvas
         * @param  {HTMLElement} svgElement
         * @return {Promise}
         */
        function toCanvas (svgElement: HTMLElement): Promise {
            var deferred = vow.defer(),
                svgData: string = new XMLSerializer().serializeToString(svgElement),
                blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'}),
                blobURL = (window.URL || window.webkitURL || window).createObjectURL(blob),
                image: HTMLImageElement = document.createElement('img'),
                canvas: HTMLCanvasElement = document.createElement('canvas');

            image.onload = function () {
                domStyle.attr(
                    canvas,
                    {width: image.width, height: image.height}
                );
                var ctx = canvas.getContext('2d');
                if (ctx == null) {
                    deferred.reject('Canvas getContext error');
                } else if (ctx instanceof CanvasRenderingContext2D) {
                    ctx.drawImage(image, 0, 0);
                    deferred.resolve(canvas);
                }
                clear();
            }
            image.onerror = function () {
                deferred.reject('Error while image loading');
                clear();
            }
            image.src = blobURL;

            function clear () {
                svgElement.remove();
                (window.URL || window.webkitURL || window).revokeObjectURL(blobURL);
            }

            return deferred.promise();
        }

        provide({
            build: function (options: Object): Object {
                if (typeof options.path != 'string') {
                    throw new Error('Expect `path` to be string');
                }

                var svgElement = domElement.create({
                        namespace: NS,
                        tagName: 'svg',
                        css: {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            zIndex: -1
                        },
                        parentNode: document.body
                    }),
                    pathElement = domElement.create({
                        namespace: NS,
                        tagName: 'path',
                        attr: {
                            // visibility: 'hidden',
                            fill: options.fill,
                            d: options.path
                        }
                    });

                svgElement.appendChild(pathElement);
                var bbox = pathElement.getBBox();

                domStyle.attr(
                    pathElement,
                    {transform: 'translate(' + -bbox.x + ', ' + -bbox.y + ')'}
                );

                domStyle.attr(
                    svgElement,
                    {width: bbox.width, height: bbox.height}
                );

                return toCanvas(svgElement);
            }
        });
    }
);
