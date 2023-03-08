import { View } from '@nativescript/core';
import { HorizontalPosition, PopoverOptions, VerticalPosition } from '.';

export * from './index.common';

export function showPopover(
    view: View,
    { anchor, vertPos = VerticalPosition.BELOW, horizPos = HorizontalPosition.CENTER, x = 0, y = 0, fitInScreen = true, onDismiss, outsideTouchable = true }: PopoverOptions
) {
    const context = anchor._context;
    const size = -2; //android.view.ViewGroup.LayoutParams.WRAP_CONTENT
    view._setupAsRootView(context);
    view._isAddedToNativeVisualTree = true;
    view.callLoaded();
    const window = new (com as any).nativescript.popover.RelativePopupWindow(view.nativeViewProtected, size, size, true);
    window.setOutsideTouchable(outsideTouchable);
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
                view._tearDownUI();
            }
        })
    );
    window.showOnAnchor(anchor.nativeViewProtected, vertPos, horizPos, x, y, fitInScreen);
    return {
        android: window,
        close: (r) => {
            result = r;
            window.dismiss();
        }
    };
}
