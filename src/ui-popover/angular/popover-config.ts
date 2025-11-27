import { ViewContainerRef } from '@angular/core';
import { PopoverOptions } from '@nativescript-community/ui-popover';

/**
 * Configuration for opening a popover with the NativePopover service.
 */
export interface NativePopoverConfig<D = any> extends Partial<PopoverOptions> {
    /**
     * Logical parent for the popover component used for dependency injection
     * and change detection. Does not affect rendering location.
     * If omitted, the service will use its own ViewContainerRef or create the
     * component/template detached.
     */
    viewContainerRef?: ViewContainerRef;

    /** ID for the popover. If omitted, a unique one will be generated. */
    id?: string;

    /** Data being injected into the child component. */
    data?: D | null;
}
