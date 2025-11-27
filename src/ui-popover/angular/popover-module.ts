import { NgModule } from '@angular/core';
import { NativePopoverCloseDirective } from './popover-content-directives';
import { NativePopover } from './popover-services';

@NgModule({
    imports: [NativePopoverCloseDirective],
    exports: [NativePopoverCloseDirective],
    providers: [NativePopover]
})
export class NativePopoverModule {}
