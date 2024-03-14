import { createNativeView, Component } from 'nativescript-vue';
import { Color, View } from '@nativescript/core'
import { showPopover, PopoverOptions, HorizontalPosition, VerticalPosition } from '..'
import { ComponentCustomProperties } from '@vue/runtime-core';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $showPopover(component: any, options: VuePopoverOptions): Promise<void>;
        $closePopover(result?: any);
    }
}

interface VuePopoverOptions {
    anchor: View;
    props?: any;
    vertPos?: VerticalPosition; // Android
    horizPos?: HorizontalPosition; // Android
    x?: number;
    y?: number;
    fitInScreen?: boolean; // Android
    outsideTouchable?: boolean;
    transparent?: boolean; // iOS
    backgroundColor?: Color; // iOS
    canOverlapSourceViewRect?: boolean; // iOS
    context?: any;
    hideArrow?: boolean; // iOS
    onDismiss?: Function;
}

const modalStack: any[] = [];

function _showPopover(component: Component, options: VuePopoverOptions): Promise<void> {
    let navEntryInstance = createNativeView(
        component,
        Object.assign(
            options.props ?? {},
        )
    )
    navEntryInstance.mount();
    const p = new Promise<void>(async (resolve, reject) => {
        let resolved = false;
        const closeCallback = (result) => {
            if (resolved) {
                return
            }
            resolved = true
            modalStack.pop()
            options.onDismiss?.()
            resolve(result)
            navEntryInstance.unmount()
            navEntryInstance = null
        }
        let opt: PopoverOptions = {
            anchor: options.anchor,
            vertPos: options.vertPos,
            horizPos: options.horizPos,
            x: options.x,
            y: options.y,
            fitInScreen: options.fitInScreen,
            outsideTouchable: options.outsideTouchable,
            transparent: options.transparent,
            backgroundColor: options.backgroundColor,
            canOverlapSourceViewRect: options.canOverlapSourceViewRect,
            context: options.context,
            hideArrow: options.hideArrow,
            onDismiss: closeCallback
        }
        try {
            modalStack.push(showPopover(navEntryInstance.nativeView, opt));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    })
    return p
}

async function _closePopover(result?: any) {
    const modalPageInstanceInfo = modalStack[modalStack.length - 1];
    if (modalPageInstanceInfo) {
        return modalPageInstanceInfo.close(result);
    }
};

const PopoverPlugin = {
    install(app) {
        const globals = app.config.globalProperties

        globals.$showPopover = _showPopover
        globals.$closePopover = _closePopover
    }
};
const usePopover = () => {
    const showPopover = async (component: Component, options: VuePopoverOptions) => await _showPopover(component, options)
    const closePopover = async (result?: any) => await _closePopover(result)

    return {
        showPopover,
        closePopover
    };
};

export { PopoverPlugin, usePopover, VuePopoverOptions };