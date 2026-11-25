// Svelte 5 binding, for @nativescript-community/svelte-native >= 5. The Svelte 4 one is in ../svelte.
import { View } from '@nativescript/core';
import { NativeViewElementNode, resolveComponentElement, type ComponentInstanceInfo, type PageSpec } from '@nativescript-community/svelte-native/dom';
import type { PopoverOptions as IPopoverOptions } from '..';
// eslint-disable-next-line no-duplicate-imports
import { showPopover as nativeShowPopover } from '..';

export { resolveComponentElement, type ComponentInstanceInfo };

export interface PopoverOptions<T> extends Omit<IPopoverOptions, 'anchor'> {
    view: PageSpec<T>;
    anchor?: NativeViewElementNode<View> | View;
    props?: T;
}

const modalStack: any[] = [];

export function showPopover<T, U>(modalOptions: PopoverOptions<U>, onCreated?: (data: ComponentInstanceInfo) => void) {
    const { view, anchor, props = {}, ...options } = modalOptions;
    // Get this before any potential new frames are created by component below
    const anchorView: View = anchor instanceof View ? anchor : anchor.nativeView;

    const componentInstanceInfo = resolveComponentElement(view, props);
    const modalView: View = componentInstanceInfo.element.nativeView;

    onCreated?.(componentInstanceInfo);
    return new Promise<T>(async (resolve, reject) => {
        let resolved = false;
        const closeCallback = (result) => {
            if (resolved) return;
            options.onDismiss?.();
            modalStack.pop();
            resolved = true;
            resolve(result);
            componentInstanceInfo.viewInstance.unmount(); // don't let an exception in unmount kill the promise callback
        };
        try {
            modalStack.push(nativeShowPopover(modalView, { ...options, anchor: anchorView, onDismiss: closeCallback }));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export async function closePopover(result?: any) {
    const modalPageInstanceInfo = modalStack[modalStack.length - 1];
    if (modalPageInstanceInfo) {
        return modalPageInstanceInfo.close(result);
    }
}
export function isPopoverOpened() {
    return modalStack.length > 0;
}
