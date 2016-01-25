ym.modules.define(
    'svgIcon.cache',
    [],
    function (provide) {
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
    }
);
