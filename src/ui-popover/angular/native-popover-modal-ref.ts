import { ApplicationRef, ComponentRef, EmbeddedViewRef, EnvironmentInjector, Injector, TemplateRef, Type, createComponent } from '@angular/core';
import { PopoverOptions, showPopover } from '@nativescript-community/ui-popover';
import { View } from '@nativescript/core';
import { Subject } from 'rxjs';
import { NativePopoverConfig } from './popover-config';

export class NativePopoverModalRef {
    _id: string;
    stateChanged = new Subject<{ state: 'opened' | 'closed' | 'closing' }>();
    onDismiss = new Subject<void>();

    _closeCallback: () => void;
    private _isDismissed = false;
    private _popoverRef: { android: any; ios: any; close: () => void };
    private _contentView: View;
    private _detachedComponentRef: ComponentRef<any> | null = null;
    private _detachedEmbeddedView: EmbeddedViewRef<any> | null = null;

    constructor(
        private _config: NativePopoverConfig,
        private _injector: Injector,
        private _applicationRef?: ApplicationRef,
        private _environmentInjector?: EnvironmentInjector
    ) {
        this._closeCallback = () => {
            this.stateChanged.next({ state: 'closing' });
            if (!this._isDismissed && this._popoverRef) {
                this._popoverRef.close();
            }

            // Clean up detached views/components
            if (this._detachedComponentRef && this._applicationRef) {
                this._applicationRef.detachView(this._detachedComponentRef.hostView);
                this._detachedComponentRef.destroy();
                this._detachedComponentRef = null;
            }

            if (this._detachedEmbeddedView && this._applicationRef) {
                this._applicationRef.detachView(this._detachedEmbeddedView);
                this._detachedEmbeddedView.destroy();
                this._detachedEmbeddedView = null;
            }

            setTimeout(() => {
                this.stateChanged.next({ state: 'closed' });
            }, 100);
        };
    }

    attachTemplatePortal<T>(template: TemplateRef<T>, context?: any, injector?: Injector): EmbeddedViewRef<T> {
        const vcRef = this._config.viewContainerRef;
        let embeddedView: EmbeddedViewRef<T>;

        if (vcRef) {
            console.log('Using provided ViewContainerRef to create embedded view');
            // Use the provided ViewContainerRef with custom injector
            embeddedView = vcRef.createEmbeddedView(template, context, { injector });
        } else {
            console.log('Creating detached embedded view for template');

            // Create a detached embedded view. We don't attempt to create a host
            // component for a custom injector here — the directive fallback uses
            // the `__ng_popover_id__` marker to find the popover ref when DI
            // isn't available.
            embeddedView = template.createEmbeddedView(context);
            this._detachedEmbeddedView = embeddedView;

            // Attach to ApplicationRef if available
            if (this._applicationRef) {
                this._applicationRef.attachView(embeddedView);
            }
        }

        try {
            (embeddedView as any).detectChanges?.();
        } catch (e) {}

        // Find the first actual NativeScript view in the root nodes
        let contentView = null;
        for (const node of embeddedView.rootNodes) {
            if (node && typeof node === 'object' && node.nodeName !== '#text') {
                console.log('Found content view in embedded view root nodes:', node);
                contentView = node;
                break;
            }
        }

        if (!contentView) {
            throw new Error('No valid content view found in template');
        }

        // Add the popover ID to the content view so the directive can find it
        if (contentView && this._id) {
            contentView['__ng_popover_id__'] = this._id;
        }

        this._contentView = contentView;

        this._showPopover();
        return embeddedView;
    }

    attachComponentPortal<T>(component: Type<T>, injector?: Injector): ComponentRef<T> {
        const vcRef = this._config.viewContainerRef;

        let componentRef: ComponentRef<T>;

        if (vcRef) {
            // Use the provided ViewContainerRef
            componentRef = vcRef.createComponent(component, { injector });
        } else {
            // Create a detached component
            componentRef = createComponent(component, {
                environmentInjector: this._environmentInjector || this._injector.get(EnvironmentInjector),
                elementInjector: injector || this._injector
            });
            this._detachedComponentRef = componentRef;

            // Attach to ApplicationRef if available
            if (this._applicationRef) {
                this._applicationRef.attachView(componentRef.hostView);
            }
        }

        try {
            componentRef.changeDetectorRef.detectChanges?.();
        } catch (e) {}

        // Try to get the actual NativeScript view from the component
        let contentView = componentRef.location.nativeElement;

        // If it's a ProxyViewContainer, try to get the first child that's an actual view
        if (contentView && contentView.getChildrenCount && contentView.getChildrenCount() > 0) {
            const firstChild = contentView.getChildAt(0);
            if (firstChild) {
                contentView = firstChild;
            }
        }

        // Add the popover ID to the content view so the directive can find it
        if (contentView && this._id) {
            contentView['__ng_popover_id__'] = this._id;
        }

        this._contentView = contentView;

        this._showPopover();
        return componentRef;
    }

    private _showPopover() {
        if (!this._contentView) {
            throw new Error('No content view to show in popover');
        }

        if (!this._config.anchor) {
            throw new Error('Anchor view is required for popover');
        }

        const popoverOptions: PopoverOptions = {
            anchor: this._config.anchor,
            vertPos: this._config.vertPos,
            horizPos: this._config.horizPos,
            x: this._config.x,
            y: this._config.y,
            fitInScreen: this._config.fitInScreen,
            outsideTouchable: this._config.outsideTouchable,
            focusable: this._config.focusable,
            transparent: this._config.transparent,
            backgroundColor: this._config.backgroundColor,
            canOverlapSourceViewRect: this._config.canOverlapSourceViewRect,
            passthroughViews: this._config.passthroughViews,
            context: this._config.context,
            hideArrow: this._config.hideArrow,
            onDismiss: () => {
                this._isDismissed = true;
                this._closeCallback();
                this.onDismiss.next();
                this.onDismiss.complete();
            }
        };

        try {
            this._popoverRef = showPopover(this._contentView, popoverOptions);
            // Emit opened state after a short delay to ensure the popover is fully shown
            setTimeout(() => {
                this.stateChanged.next({ state: 'opened' });
            }, 50);
        } catch (error) {
            console.error('Error showing popover:', error);
            this.stateChanged.next({ state: 'closed' });
        }
    }
}
