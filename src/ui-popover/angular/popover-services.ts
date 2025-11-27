import { ApplicationRef, EnvironmentInjector, inject, Injectable, InjectionToken, Injector, OnDestroy, StaticProvider, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NativePopoverModalRef } from './native-popover-modal-ref';
import { NativePopoverConfig } from './popover-config';
import { NativePopoverRef } from './popover-ref';

/** Injection token that can be used to access the data that was passed in to a popover. */
export const NATIVE_POPOVER_DATA = new InjectionToken<any>('NativePopoverData');

/** Injection token that can be used to specify default popover options. */
export const NATIVE_POPOVER_DEFAULT_OPTIONS = new InjectionToken<NativePopoverConfig>('native-popover-default-options');

/**
 * Service for opening popovers.
 */
@Injectable({
    providedIn: 'root'
})
export class NativePopover implements OnDestroy {
    private readonly _afterOpenedAtThisLevel = new Subject<NativePopoverRef<any>>();
    private readonly _openPopovers = new Map<string, NativePopoverRef<any>>();

    /** Stream that emits when a popover has been opened. */
    get afterOpened(): Subject<NativePopoverRef<any>> {
        return this._afterOpenedAtThisLevel;
    }

    /**
     * Gets a popover by its ID from the currently open popovers.
     * @param id ID to use when looking up the popover.
     */
    getPopoverById(id: string): NativePopoverRef<any> | undefined {
        return this._openPopovers.get(id);
    }

    private _injector = inject(Injector);
    private _viewContainerRef = inject(ViewContainerRef, { optional: true });
    private _applicationRef = inject(ApplicationRef);
    private _environmentInjector = inject(EnvironmentInjector);
    private _defaultOptions = inject(NATIVE_POPOVER_DEFAULT_OPTIONS, {
        optional: true
    });

    /**
     * Opens a popover containing the given component.
     * @param component Type of the component to load into the popover.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened popover.
     */
    open<T, D = any, R = any>(component: Type<T>, config: NativePopoverConfig<D>): NativePopoverRef<T, R>;

    /**
     * Opens a popover containing the given template.
     * @param template TemplateRef to instantiate as the popover content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened popover.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config: NativePopoverConfig<D>): NativePopoverRef<T, R>;

    open<T, D = any, R = any>(template: Type<T> | TemplateRef<T>, config: NativePopoverConfig<D>): NativePopoverRef<T, R>;

    open<T, D = any, R = any>(componentOrTemplateRef: Type<T> | TemplateRef<T>, config: NativePopoverConfig<D>): NativePopoverRef<T, R> {
        if (!config.anchor) {
            throw new Error('Anchor view is required for popovers');
        }

        // Provide ViewContainerRef if not specified and available
        if (!config.viewContainerRef && this._viewContainerRef) {
            config.viewContainerRef = this._viewContainerRef;
        }

        config = _applyConfigDefaults(config, this._defaultOptions || ({} as NativePopoverConfig));

        const popoverRef = this._attachPopoverContent<T, R>(componentOrTemplateRef, config);

        // Register the popover and set up cleanup
        this._openPopovers.set(popoverRef.id, popoverRef);
        popoverRef.afterClosed().subscribe(() => {
            this._openPopovers.delete(popoverRef.id);
        });

        // Simply emit that a popover was opened
        this.afterOpened.next(popoverRef);

        return popoverRef;
    }

    ngOnDestroy() {
        // Close all open popovers when the service is destroyed
        this._openPopovers.forEach((popover) => popover.close());
        this._openPopovers.clear();
        this._afterOpenedAtThisLevel.complete();
    }

    /**
     * Attaches the user-provided component to the popover.
     * @param componentOrTemplateRef The type of component being loaded into the popover,
     *     or a TemplateRef to instantiate as the content.
     * @param config The popover configuration.
     * @returns A reference to the popover that should be returned to the user.
     */
    private _attachPopoverContent<T, R>(componentOrTemplateRef: Type<T> | TemplateRef<T>, config: NativePopoverConfig): NativePopoverRef<T, R> {
        // Create a reference to the popover we're creating in order to give the user a handle
        // to modify and close it.
        const nativePopoverModalRef = new NativePopoverModalRef(config, this._injector, this._applicationRef, this._environmentInjector);
        const popoverRef = new NativePopoverRef<T, R>(nativePopoverModalRef, config.id);

        if (componentOrTemplateRef instanceof TemplateRef) {
            const injector = this._createInjector<T>(config, popoverRef);
            // Provide both `$implicit` and a named `data` field so templates using
            // `let-data="data"` or `let-data` both receive the passed-in data.
            nativePopoverModalRef.attachTemplatePortal(componentOrTemplateRef as any, { $implicit: config.data, data: config.data, popoverRef }, injector);
        } else {
            const injector = this._createInjector<T>(config, popoverRef);
            const contentRef = nativePopoverModalRef.attachComponentPortal(componentOrTemplateRef, injector);
            popoverRef.componentInstance = contentRef.instance;
        }

        return popoverRef;
    }

    /**
     * Creates a custom injector to be used inside the popover. This allows a component loaded inside
     * of a popover to close itself and, optionally, to return a value.
     * @param config Config object that is used to construct the popover.
     * @param popoverRef Reference to the popover.
     * @returns The custom injector that can be used inside the popover.
     */
    private _createInjector<T>(config: NativePopoverConfig, popoverRef: NativePopoverRef<T>): Injector {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

        const providers: StaticProvider[] = [
            { provide: NATIVE_POPOVER_DATA, useValue: config.data },
            { provide: NativePopoverRef, useValue: popoverRef }
        ];

        return Injector.create({ parent: userInjector || this._injector, providers });
    }
}

/**
 * Applies default options to the popover config.
 * @param config Config to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new configuration object.
 */
function _applyConfigDefaults(config?: NativePopoverConfig, defaultOptions?: NativePopoverConfig): NativePopoverConfig {
    return { ...defaultOptions, ...config };
}
