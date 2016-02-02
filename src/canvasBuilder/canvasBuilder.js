/* flow */
ym.modules.define(
    'svgIcon.canvasBuilder',
    [
        'util.dom.element',
        'util.dom.style',
        'vow',
        'storage.svgIcon',
        'util.svgTools'
    ],
    function (provide: Function, domElement: Object, domStyle: Object,
        vow: Object, storage: Object, svgTools: Object) {

        /**
         * Apply matrix transform to coordinates
         * @param  {Array[Number]} coords
         * @param  {Array[Number]} matrix
         * @return {Array[Number]}
         */
        function applyMatrix (coords, matrix) {
            return [
                coords[0] * matrix[0] + coords[1] * matrix[2] + matrix[4],
                coords[0] * matrix[1] + coords[1] * matrix[3] + matrix[5]
            ];
        }

        /**
         * Translate path by given numbers
         * @param  {Array} path
         * @param  {Array[Number]} matrix
         * @return {Array[]}
         */
        function transform (path, matrix) {
            var o = [];

            path.forEach(function (command) {
                var l = [command[0]],
                    i;
                for (i = 1; i < command.length; i += 2) {
                    l = l.concat(applyMatrix([command[i], command[i + 1]], matrix));
                }
                o.push(l);
            });

            return o;
        }

        function scale (path, scaleFactor) {
            return transform(path, [scaleFactor, 0, 0, scaleFactor, 0, 0]);
        }

        function translate (path, x, y) {
            return transform(path, [1, 0, 0, 1, x, y]);
        }

        function getDataFromPath (path, options) {
            var bbox = svgTools.getBBox(path);

            path = translate(svgTools.toCubic(path), -bbox.x, -bbox.y);
            path = scale(path, options.scale);

            return {
                path: path,
                width: bbox.width * options.scale,
                height: bbox.height * options.scale
            };
        }

        provide({
            build: function (options: Object): HTMLCanvasElement {
                var canvas = document.createElement('canvas'),
                    path = options.path,
                    pathData = storage.get(path),
                    ctx;

                if (!pathData) {
                    pathData = getDataFromPath(path, options);
                    storage.set(path, pathData);
                }

                ctx = canvas.getContext('2d');

                canvas.width = pathData.width;
                canvas.height = pathData.height;

                ctx.beginPath();
                ctx.fillStyle = options.fill;
                pathData.path.forEach(function (cm) {
                    var canvasCmd = cm[0].toLowerCase() == 'm' ? 'moveTo' : 'bezierCurveTo';
                    ctx[canvasCmd].apply(ctx, cm.slice(1));
                });
                ctx.fill();

                return canvas;
            }
        });
    }
);
