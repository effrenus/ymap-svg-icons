/* flow */
ym.modules.define(
    'svgIcon.canvasBuilder',
    [
        'util.dom.element',
        'util.dom.style',
        'vow'
    ],
    function (provide: Function, domElement: Object, domStyle: Object, vow: Object) {

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
        function translate (path, matrix) {
            var o = [];

            path.forEach(function (command) {
                var l = [command[0]];
                for (var i = 1; i < command.length; i += 2) {
                    l = l.concat(applyMatrix([command[i], command[i + 1]], matrix));
                }
                o.push(l);
            });

            return o;
        }

        provide({
            build: function (options: Object): HTMLCanvasElement {
                var canvas = document.createElement('canvas'),
                    bbox = Snap.path.getBBox(options.path),
                    transformMatrix = [1, 0, 0, 1, -bbox.x, -bbox.y],
                    path = translate(Snap.path.toCubic(options.path), transformMatrix);

                var ctx = canvas.getContext('2d');

                canvas.width = bbox.width;
                canvas.height = bbox.height;

                ctx.beginPath();
                ctx.fillStyle = options.fill;
                path.forEach(function (cm) {
                    var canvasCmd = cm[0].toLowerCase() == 'm' ? 'moveTo' : 'bezierCurveTo';
                    ctx[canvasCmd].apply(ctx, cm.splice(1));
                });
                ctx.fill();

                return canvas;
            }
        });
    }
);