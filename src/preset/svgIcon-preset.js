/* flow */
/**
 * @fileOverview
 *
 */
ym.modules.define('svgIcon', [
    'option.presetStorage',

    'svgIcon.layout'
], function (provide, presets) {

    presets.add('custom#svgIcon', {
        iconLayout: 'svg#iconLayout'
    });

    provide({});
});
