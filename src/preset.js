/* flow */
/**
 * @fileOverview
 *
 */
ym.modules.define('preset.svgIcon', [
    'option.presetStorage',

    'layout.svgIcon'
], function (provide, presets) {

    presets.add('custom#svgIcon', {
        iconLayout: 'svg#iconLayout'
    });

    provide({});
});
