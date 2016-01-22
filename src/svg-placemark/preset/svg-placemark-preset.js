/**
 * @fileOverview
 *
 */
ym.modules.define('svg.preset', [
    'option.presetStorage',
    'svg.layout'
], function (provide, presets) {

    presets.add('svg#Placemark', {
        iconLayout: 'svg#iconLayout'
    });

    provide(true);
});
