import { HorizontalPosition, VerticalPosition } from './index.common';
import { View } from '@nativescript/core';
export * from './index.common';

export interface PopoverOptions {
    anchor: View;
    vertPos?: VerticalPosition;
    horizPos?: HorizontalPosition;
    x?: number;
    y?: number;
    fitInScreen?: boolean;
    onDismiss?: Function;
}
export function showPopover(view: View, options: PopoverOptions): any;
