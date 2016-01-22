/**
 * @fileOverview
 *
 */
ym.modules.define('svg.preset', [
    'option.presetStorage',
    'svg.layout'
], function (provide, presets) {

    presets.add('custom#svgIcon', {
        iconLayout: 'svg#iconLayout'
    });

    provide(true);
});
