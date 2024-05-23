import { Application, Color, IOSHelper, Screen, Trace, Utils, View } from '@nativescript/core';
import { HorizontalPosition, PopoverOptions, VerticalPosition, _commonPopoverDismissed, _commonShowNativePopover } from '.';

export * from './index.common';

@NativeClass
class UIPopoverPresentationControllerDelegateImpl extends NSObject implements UIPopoverPresentationControllerDelegate {
    static ObjCProtocols = [UIPopoverPresentationControllerDelegate];
    private _options: any;

    static initWithOptions(options) {
        const delegate = new UIPopoverPresentationControllerDelegateImpl();
        delegate._options = options;
        return delegate;
    }

    adaptivePresentationStyleForPresentationControllerTraitCollection(controller: UIPresentationController, traitCollection): UIModalPresentationStyle {
        return UIModalPresentationStyle.None;
    }

    popoverPresentationControllerDidDismissPopover(popoverPresentationController: UIPopoverPresentationController): void {
        if (this._options.onDismiss) {
            this._options.onDismiss();
        }
    }

    popoverPresentationControllerShouldDismissPopover(popoverPresentationController: UIPopoverPresentationController): any {
        return this._options?.outsideTouchable;
    }
}

@NativeClass
class PopoverViewController extends UIViewController {
    public owner: WeakRef<View>;
    public nBackgroundColor: UIColor;
    public static initWithOwner(owner: WeakRef<View>): PopoverViewController {
        const controller = PopoverViewController.new() as PopoverViewController;
        controller.owner = owner;

        return controller;
    }
    loadView(): void {
        this.view = createUIViewAutoSizeUIViewAutoSize(this.owner.get());
    }
    viewDidLoad(): void {
        super.viewDidLoad();
        const size = this.view.systemLayoutSizeFittingSize(UILayoutFittingExpandedSize);
        this.preferredContentSize = size;
    }
    viewWillAppear(animated: boolean) {
        if (this.nBackgroundColor) {
            this.view.superview.backgroundColor = this.nBackgroundColor;
        }
        super.viewWillAppear(animated);
    }
}

@NativeClass
class UIViewAutoSizeUIViewAutoSize extends UIView {
    _view: WeakRef<View>;
    systemLayoutSizeFittingSize(boundsSize: CGSize) {
        const view = this._view?.get();
        if (!view) {
            return CGSizeZero;
        }
        const widthSpec = Utils.layout.makeMeasureSpec(Math.max(Screen.mainScreen.widthPixels, Utils.layout.toDevicePixels(boundsSize.width)), Utils.layout.AT_MOST);
        const heighthSpec = Utils.layout.makeMeasureSpec(Math.max(Screen.mainScreen.widthPixels, Utils.layout.toDevicePixels(boundsSize.height)), Utils.layout.AT_MOST);
        const measuredSize = View.measureChild(null, view, widthSpec, heighthSpec);
        view.setMeasuredDimension(measuredSize.measuredWidth, measuredSize.measuredHeight);
        const size = CGSizeMake(Utils.layout.toDeviceIndependentPixels(measuredSize.measuredWidth), Utils.layout.toDeviceIndependentPixels(measuredSize.measuredHeight));
        return size;
    }
    layoutSubviews() {
        const view = this._view?.get();
        if (!view) {
            return;
        }
        const size = this.frame.size;
        View.layoutChild(null, view, 0, 0, Utils.layout.toDevicePixels(size.width), Utils.layout.toDevicePixels(size.height));
    }
}

function createUIViewAutoSizeUIViewAutoSize(view: View) {
    const self = UIViewAutoSizeUIViewAutoSize.new() as UIViewAutoSizeUIViewAutoSize;
    view._setupAsRootView({});
    view.parent = Application.getRootView();
    view._isAddedToNativeVisualTree = true;
    view.callLoaded();
    self._view = new WeakRef(view);
    self.addSubview(view.nativeViewProtected);
    (view.nativeViewProtected as UIView).autoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleHeight;
    return self;
}

export function showPopover(
    view: View,
    {
        anchor,
        vertPos = VerticalPosition.BELOW,
        horizPos = HorizontalPosition.CENTER,
        x = 0,
        y = 0,
        fitInScreen = true,
        transparent = false,
        onDismiss,
        outsideTouchable = true,
        backgroundColor,
        canOverlapSourceViewRect = false,
        passthroughViews = null,
        context = {},
        hideArrow = false
    }: PopoverOptions
) {
    _commonShowNativePopover(view);
    let parentWithController = IOSHelper.getParentWithViewController(anchor);
    if (!parentWithController) {
        Trace.write(`Could not find parent with viewController for ${parent} while showing bottom sheet view.`, Trace.categories.ViewHierarchy, Trace.messageType.error);
        throw new Error('missing_parent_controller');
    }

    let parentController = parentWithController.viewController;
    // we loop to ensure we are showing from the top presented view controller
    while (parentController.presentedViewController) {
        parentController = parentController.presentedViewController;
        parentWithController = parentWithController['_modal'] || parentWithController;
    }
    const controller = PopoverViewController.initWithOwner(new WeakRef(view));
    view.viewController = controller;
    let result;
    function _onDismiss() {
        onDismiss?.(result);
        controller.popoverPresentationController.delegate = null;
        if (view && view.isLoaded) {
            view.callUnloaded();
        }
        _commonPopoverDismissed(view);
        view._isAddedToNativeVisualTree = false;
        view._tearDownUI();
        view.parent = null;
    }
    controller.modalPresentationStyle = UIModalPresentationStyle.Popover;
    if (!controller.popoverPresentationController.delegate) {
        controller.popoverPresentationController.delegate = UIPopoverPresentationControllerDelegateImpl.initWithOptions({
            outsideTouchable,
            onDismiss: _onDismiss
        });
    }
    if (hideArrow || transparent) {
        controller.popoverPresentationController.permittedArrowDirections = 0 as any;
    }
    //@ts-ignore
    controller.popoverPresentationController.passthroughViews = passthroughViews?.map((v) => v?.nativeViewProtected).filter((v) => !!v);
    controller.popoverPresentationController.canOverlapSourceViewRect = canOverlapSourceViewRect;
    if (transparent) {
        controller.nBackgroundColor = UIColor.clearColor;
    } else if (backgroundColor) {
        controller.nBackgroundColor = (backgroundColor instanceof Color ? backgroundColor : new Color(backgroundColor)).ios;
        // controller.popoverPresentationController.backgroundColor = backgroundColor.ios;
    } else if (view.style.backgroundColor) {
        controller.nBackgroundColor = view.style.backgroundColor.ios;
        controller.popoverPresentationController.backgroundColor = view.style.backgroundColor.ios;
    }
    controller.popoverPresentationController.sourceView = anchor.nativeViewProtected;
    controller.popoverPresentationController.sourceRect = CGRectOffset(anchor.nativeViewProtected.bounds as CGRect, x, y);
    parentWithController.viewController.presentModalViewControllerAnimated(controller, true);
    return {
        ios: controller,
        close: async (r) => {
            result = r;
            return new Promise<void>((resolve) => {
                parentController.dismissViewControllerAnimatedCompletion(true, () => {
                    _onDismiss();
                    resolve();
                });
            });
        }
    };
}
