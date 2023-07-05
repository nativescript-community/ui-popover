import { Builder, CSSUtils, View, ViewBase } from '@nativescript/core';
export enum HorizontalPosition {
    CENTER,
    LEFT,
    RIGHT,
    ALIGN_LEFT,
    ALIGN_RIGHT
}
export enum VerticalPosition {
    CENTER,
    ABOVE,
    BELOW,
    ALIGN_TOP,
    ALIGN_BOTTOM
}

export function _commonShowNativePopover(view: View) {
    view._getRootModalViews().push(view);
    view.cssClasses.add(CSSUtils.MODAL_ROOT_VIEW_CSS_CLASS);
    const modalRootViewCssClasses = CSSUtils.getSystemCssClasses();
    modalRootViewCssClasses.forEach((c) => view.cssClasses.add(c));
}
export function _commonPopoverDismissed(view: View) {
    const _rootModalViews = view._getRootModalViews();
    const modalIndex = _rootModalViews.indexOf(view);
    _rootModalViews.splice(modalIndex);
}
