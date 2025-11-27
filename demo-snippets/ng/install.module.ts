import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativePopoverModule } from '@nativescript-community/ui-popover/angular';
import { BasicPopoverComponent } from './basic-popover/basic-popover.component';
import { TemplatedPopoverComponent } from './templated-popover/templated-popover.component';
import { AdvancedPopoverComponent } from './advanced-popover/advanced-popover.component';

@NgModule({
    imports: [NativePopoverModule],
    exports: [NativePopoverModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class InstallModule {}

export function installPlugin() {
    // No additional installation needed for ui-popover
}

export const demos = [
    { name: 'Basic Popover', path: 'basic-popover', component: BasicPopoverComponent },
    { name: 'Templated Popover', path: 'templated-popover', component: TemplatedPopoverComponent },
    { name: 'Advanced Popover', path: 'advanced-popover', component: AdvancedPopoverComponent }
];
