const hcSticky = require('hc-sticky');


let vueHcSticky = {}

const stick = (el, bindOptions, Vue) => {

    let {
        stickTo = 'parent',
        innerSticker = false,
        followScroll = false,
        top = 0,
        innerTop = 0,
        onStart = null,
        onStop = null,
        timeout = 0,
        updatable = true,
        enable = true,
        disable = false
    } = bindOptions;

    if (typeof stickTo === 'string') {

        switch (stickTo) {

            case 'parent':
                stickTo = el.parentElement;
                break;

            /*
            case 'column_closest':     stickTo = el.closest('.elementor-column-wrap'); break;
            case 'column_root':        stickTo = el.parents('.elementor-column-wrap').last(); break;
            case 'row_closest':        stickTo = el.closest('.elementor-row'); break;
            case 'widget_closest':     stickTo = el.closest('.elementor-widget'); break;

             */
            default:
                stickTo = document.querySelector(stickTo);
                break;
        }
    }

    switch (innerSticker) {
        case 'parent':
            innerSticker = el.parent();
            break;
        default:
            innerSticker = document.querySelector(innerSticker);
            break;
    }

    if (stickTo) {

        var options = {
            stickTo: stickTo,
            followScroll: followScroll,
            innerSticker: innerSticker,
            top: top,
            innerTop: innerTop,
            onStart: onStart,
            onStop: onStop,
            updatable: updatable,
            enable: enable,
            disable: disable
        };

        if (enable) {
            if (timeout) {
                setTimeout(() => {
                    el.hcsticky = new hcSticky(el, options);
                }, timeout)
            } else {
                el.hcsticky = new hcSticky(el, options);
            }
        }

        el.hcstickyOptions = options

        el.hcstickyUpdate = (options = {}) => {

            el.hcstickyOptions = {
                ...el.hcstickyOptions,
                ...options
            }

            if (el.hcsticky)
              el.hcsticky.update(options)
        }

        // Vue.prototype.$bus.on('sticky-update', el.hcstickyUpdate)
    }

}

vueHcSticky.install = function (Vue) {

    Vue.directive('hc-sticky', {

        inserted: function (el, binding, vnode) {

            stick(el, binding.value, Vue)

        },
        unbind(el, bind, vnode) {
            if (el.hcsticky) {
                //Vue.prototype.$bus.off('sticky-update', el.hcstickyUpdate)

                el.hcsticky.destroy();
                el.hcsticky = undefined
                el.hcstickyUpdate = undefined
            }
        },
        componentUpdated(el, binding, vnode) {

            const options = {
                enable: binding.value.enable,
                disable: binding.value.disable,
                top: binding.value.top,
                updateDisable: binding.value.updateDisable
            };

            if (options.updateDisable) return

            if (el.hcsticky) {
                el.hcsticky.update(options);
            } else {
                stick(el, binding.value, Vue)
            }

            return;

            if (!options.enable) {
                el.hcsticky.detach();
            } else {
                el.hcsticky.attach();
            }


            /*
            if (typeof bind.value === 'undefined' || bind.value) {
                if (!el[namespace]) {
                    el[namespace] = new Sticky(el, vnode.context)
                }
                el[namespace].doBind()
            } else {
                if (el[namespace]) {
                    el[namespace].doUnbind()
                }
            }
            */
        }
    })
}

export default vueHcSticky
