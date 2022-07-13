import { NativeScriptVue } from 'nativescript-vue';
import Vue from 'vue';
import { PopoverOptions, showPopover } from '..';
import { View } from '@nativescript/core';

export interface VuePopoverOptions extends Omit<PopoverOptions, 'anchor'> {
    anchor: NativeScriptVue<View> | View;
    props?: any;
}
const modalStack: any[] = [];

declare module 'nativescript-vue' {
    interface NativeScriptVue<V = View> extends Vue {
        $showPopover(component: typeof Vue, options?: VuePopoverOptions): Promise<any>;
        $closePopover(...args);
    }
}

let sequentialCounter = 0;

function serializeModalOptions(options) {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    const allowed = ['anchor', 'vertPos', 'horPos', 'x', 'y', 'fitInScreen'];

    return (
        Object.keys(options)
            .filter((key) => allowed.includes(key))
            .map((key) => `${key}: ${options[key]}`)
            .concat(`uid: ${++sequentialCounter}`)
            .join(', ') + '_Popover'
    );
}

const PopoverPlugin = {
    install(Vue) {
        Vue.prototype.$showPopover = function (component, options: VuePopoverOptions) {
            return new Promise((resolve: (...args) => void) => {
                const resolved = false;
                let navEntryInstance = new Vue({
                    name: 'PopoverEntry',
                    parent: this.$root,
                    render: (h) =>
                        h(component, {
                            props: options.props,
                            key: serializeModalOptions(options)
                        })
                });
                const anchorView: View = options.anchor instanceof View ? options.anchor : options.anchor.nativeView;
                navEntryInstance.$mount();
                // if (!(modalView instanceof GestureRootView)) {
                //     const gestureView = new GestureRootView();
                //     gestureView.height = modalView.height;
                //     gestureView.addChild(modalView);
                //     modalView = gestureView;
                // }

                return new Promise<void>(async (resolve, reject) => {
                    let resolved = false;
                    const closeCallback = () => {
                        if (resolved) return;
                        resolved = true;
                        modalStack.pop();
                        options.onDismiss?.();
                        resolve();
                        navEntryInstance.$emit('popover:close');
                        navEntryInstance.$destroy(); // don't let an exception in destroy kill the promise callback
                        navEntryInstance = null;
                    };
                    try {
                        modalStack.push(showPopover(navEntryInstance.nativeView, { ...options, anchor: anchorView, onDismiss: closeCallback }));
                    } catch (err) {
                        console.error(err);
                        reject(err);
                    }
                });
            });
        };
        Vue.prototype.$closePopover = function (...args) {
            const modalPageInstanceInfo = modalStack[modalStack.length - 1];
            if (modalPageInstanceInfo) {
                modalPageInstanceInfo.dismiss();
            }
        };
    }
};

export default PopoverPlugin;
