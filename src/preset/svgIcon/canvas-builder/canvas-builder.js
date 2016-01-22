ym.modules.define(
    'svg.canvasBuilder',
    [
        'util.dom.element',
        'util.dom.style',
        'vow'
    ],
    function (provide, domElement, domStyle, vow) {

        var NS = 'http://www.w3.org/2000/svg';

        /**
         * Draw SVG on Canvas
         * @param  {HTMLElement} svgElement
         * @return {Promise}
         */
        function toCanvas (svgElement) {
            var deferred = vow.defer(),
                svgData = new XMLSerializer().serializeToString(svgElement);
                blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                blobURL = (window.URL || window.webkitURL || window).createObjectURL(blob),
                image = document.createElement('img'),
                canvas = document.createElement('canvas');

            image.onload = function () {
                domStyle.attr(
                    canvas,
                    {width: image.width, height: image.height}
                );
                canvas.getContext('2d').drawImage(image, 0, 0);
                deferred.resolve(canvas);
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
            build: function (options) {
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
