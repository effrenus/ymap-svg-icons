(function (global){


var ym = {
	"project": {
		"preload": [],
		"namespace": "ym",
		"jsonpPrefix": "",
		"loadLimit": 500
	},
	"ns": {},
	"env": {},
	"envCallbacks": []
};

ym.modules = global['ym'].modules;

/* flow */
/**
 * @fileOverview
 *
 */
ym.modules.define('svgIcon', ['option.presetStorage', 'svgIcon.layout'], function (provide, presets) {

    presets.add('custom#svgIcon', {
        iconLayout: 'svg#iconLayout'
    });

    provide({});
});
ym.modules.define('svgIcon.cache', [], function (provide) {
    var cache = {},
        KEY_PREFIX = 'path_';

    var cacher = {
        set: function (key, val) {
            cache[cacher.getKey(key)] = val;
        },
        get: function (key) {
            return cache[cacher.getKey(key)];
        },
        isExist: function (key) {
            return !!cache[cacher.getKey(key)];
        },
        getKey: function (key) {
            return key.indexOf(KEY_PREFIX) === -1 ? cacher.generateKey(key) : key;
        },
        generateKey: function (path) {
            return KEY_PREFIX + path.replace(/[, -]/g, '').toLowerCase();
        }
    };

    provide(cacher);
});
/* flow */
ym.modules.define('svgIcon.canvasBuilder', ['util.dom.element', 'util.dom.style', 'vow', 'svgIcon.cache'], function (provide, domElement, domStyle, vow, cache) {

    /**
     * Apply matrix transform to coordinates
     * @param  {Array[Number]} coords
     * @param  {Array[Number]} matrix
     * @return {Array[Number]}
     */
    function applyMatrix(coords, matrix) {
        return [coords[0] * matrix[0] + coords[1] * matrix[2] + matrix[4], coords[0] * matrix[1] + coords[1] * matrix[3] + matrix[5]];
    }

    /**
     * Translate path by given numbers
     * @param  {Array} path
     * @param  {Array[Number]} matrix
     * @return {Array[]}
     */
    function transform(path, matrix) {
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

    function scale(path, scaleFactor) {
        return transform(path, [scaleFactor, 0, 0, scaleFactor, 0, 0]);
    }

    function translate(path, x, y) {
        return transform(path, [1, 0, 0, 1, x, y]);
    }

    function getDataFromPath(path, options) {
        var bbox = Snap.path.getBBox(path),
            path = translate(Snap.path.toCubic(path), -bbox.x, -bbox.y),
            path = scale(path, options.scale);

        return {
            path: path,
            width: bbox.width * options.scale,
            height: bbox.height * options.scale
        };
    }

    provide({
        build: function (options) {
            var canvas = document.createElement('canvas'),
                path = options.path,
                pathData = cache.get(path);

            if (!pathData) {
                pathData = getDataFromPath(path, options);
                cache.set(path, pathData);
            }

            var ctx = canvas.getContext('2d');

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
});
/* flow */
ym.modules.define('svgIcon.layout', ['templateLayoutFactory', 'util.css', 'Monitor', 'layout.storage', 'util.dom.style', 'util.dom.element', 'svgIcon.canvasBuilder', 'svgIcon.pathCollection'], function (provide, templateLayoutFactory, utilCss, Monitor, layoutStorage, domStyle, domElement, canvasBuilder, svgPathCollection) {

    var ICON_CLASS = utilCss.addPrefix('svg-icon'),
        LABEL_CLASS = utilCss.addPrefix('svg-label');

    var IconLayout = templateLayoutFactory.createClass(['<ymaps class=' + ICON_CLASS + ' style="display: block">', '<i class="' + LABEL_CLASS + '"></i>', '</ymaps>'].join(''), {
        build: function () {
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

        _setupAll: function () {
            this._canvas = canvasBuilder.build({
                path: this.options.get('path', svgPathCollection.SQUARE_PIN),
                fill: this.options.get('fill', '#555555'),
                scale: this.options.get('scale', 1)
            });

            var shape = {
                type: 'Rectangle',
                coordinates: [[0, 0], [this._canvas.width, this._canvas.height]]
            };

            this.options.set({
                shape: this.options.get('shape', shape)
            });

            this._setupCanvas();
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
                textAlign: 'center',
                lineHeight: this._canvas.height + 'px'
            });
            labelElement.className += ' ' + this.getData().options.get('label', '');
        },

        _setupCanvas: function () {
            domElement.findByClassName(this.getElement(), ICON_CLASS).appendChild(this._canvas);
        },

        _onAfterBuild: function () {
            var canvas = this._canvas;

            this.options.getParent().set('offset', [-canvas.width / 2, -canvas.height]);
            domStyle.css(this.getElement(), {
                visibility: 'visible'
            });
        },

        _removeCanvas: function () {
            this._canvas && this._canvas.remove();
            this._canvas = null;
        }
    });

    layoutStorage.add('svg#iconLayout', IconLayout);

    provide(IconLayout);
});
/* flow */
ym.modules.define('svgIcon.pathCollection', function (provide) {

    provide({
        SHIELD: 'M18.8-31.8c.3-3.4 1.3-6.6 3.2-9.5l-7-6.7c-2.2 1.8-4.8 2.8-7.6 3-2.6.2-5.1-.2-7.5-1.4-2.4 1.1-4.9 1.6-7.5 1.4-2.7-.2-5.1-1.1-7.3-2.7l-7.1 6.7c1.7 2.9 2.7 6 2.9 9.2.1 1.5-.3 3.5-1.3 6.1-.5 1.5-.9 2.7-1.2 3.8-.2 1-.4 1.9-.5 2.5 0 2.8.8 5.3 2.5 7.5 1.3 1.6 3.5 3.4 6.5 5.4 3.3 1.6 5.8 2.6 7.6 3.1.5.2 1 .4 1.5.7l1.5.6c1.2.7 2 1.4 2.4 2.1.5-.8 1.3-1.5 2.4-2.1.7-.3 1.3-.5 1.9-.8.5-.2.9-.4 1.1-.5.4-.1.9-.3 1.5-.6.6-.2 1.3-.5 2.2-.8 1.7-.6 3-1.1 3.8-1.6 2.9-2 5.1-3.8 6.4-5.3 1.7-2.2 2.6-4.8 2.5-7.6-.1-1.3-.7-3.3-1.7-6.1-.9-2.8-1.3-4.9-1.2-6.4z',
        ROUTE: 'M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z',
        SQUARE_PIN: 'M22-48h-44v43h16l6 5 6-5h16z',
        SQUARE: 'M-24-48h48v48h-48z',
        SQUARE_ROUNDED: 'M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z'
    });
});

})(this);