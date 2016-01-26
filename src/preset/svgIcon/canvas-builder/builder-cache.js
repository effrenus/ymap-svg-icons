ym.modules.define(
    'svgIcon.cache',
    [],
    function (provide) {
        var KEY_PREFIX = 'path_',
            _cache = {},
            cacher;

        cacher = {
            set: function (key, val) {
                _cache[cacher.getKey(key)] = val;
            },
            get: function (key) {
                return _cache[cacher.getKey(key)];
            },
            isExist: function (key) {
                return Boolean(_cache[cacher.getKey(key)]);
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
