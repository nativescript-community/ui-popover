import { HorizontalPosition, VerticalPosition } from './index.common';
import { Color, View } from '@nativescript/core';
export * from './index.common';

export interface PopoverOptions {
    anchor: View;
    vertPos?: VerticalPosition; // Android
    horizPos?: HorizontalPosition; // Android
    x?: number;
    y?: number;
    fitInScreen?: boolean; // Android
    outsideTouchable?: boolean;
    focusable?: boolean; // Android
    transparent?: boolean; // iOS
    backgroundColor?: Color | string; // iOS
    canOverlapSourceViewRect?: boolean; // iOS
    passthroughViews?: View[]; // iOS
    context?: any;
    hideArrow?: boolean; // iOS
    onDismiss?: Function;
}
export function showPopover(view: View, options: PopoverOptions): { android: any; ios: any; close: () => void };
