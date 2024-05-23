import { Application, View } from '@nativescript/core';
import { HorizontalPosition, PopoverOptions, VerticalPosition, _commonPopoverDismissed, _commonShowNativePopover } from '.';

export * from './index.common';

export function showPopover(
    view: View,
    { anchor, vertPos = VerticalPosition.BELOW, horizPos = HorizontalPosition.CENTER, x = 0, y = 0, fitInScreen = true, onDismiss, outsideTouchable = true, focusable = true }: PopoverOptions
) {
    const context = anchor._context;
    _commonShowNativePopover(view);
    const size = -2; //android.view.ViewGroup.LayoutParams.WRAP_CONTENT
    view._setupAsRootView(context);
    view.parent = Application.getRootView();
    view._isAddedToNativeVisualTree = true;
    view.callLoaded();
    const window = new (com as any).nativescript.popover.RelativePopupWindow(view.nativeViewProtected, size, size, true) as android.widget.PopupWindow;
    window.setOutsideTouchable(outsideTouchable);
    window.setFocusable(focusable);
    window.setBackgroundDrawable(null);
    let result;
    window.setOnDismissListener(
        new android.widget.PopupWindow.OnDismissListener({
            onDismiss() {
                if (onDismiss) {
                    onDismiss(result);
                }
                if (view && view.isLoaded) {
                    view.callUnloaded();
                }
                view._isAddedToNativeVisualTree = false;
                _commonPopoverDismissed(view);
                view._tearDownUI();
                view.parent = null;
            }
        })
    );
    (window as any).showOnAnchor(anchor.nativeViewProtected, vertPos, horizPos, x, y, fitInScreen);
    return {
        android: window,
        close: async (r) => {
            result = r;
            window.dismiss();
        }
    };
}
