import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { NATIVE_POPOVER_DATA, NativePopover, NativePopoverCloseDirective, NativePopoverConfig, NativePopoverModule } from '@nativescript-community/ui-popover/angular';
import { View } from '@nativescript/core';

@Component({
    selector: 'ns-popover-content',
    standalone: true,
    template: `
        <StackLayout padding="20" borderColor="black" borderRadius="5" borderWidth="1" backgroundColor="white">
            <Label>data: {{ data?.message }}</Label>
            <Button text="Show Nested Popover" (tap)="showNestedPopover(nestedAnchor)" #nestedAnchor></Button>
            <Button text="Close" native-popover-close="closed with button"></Button>
        </StackLayout>
    `,
    imports: [NativePopoverCloseDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PopoverContentComponent {
    data = inject(NATIVE_POPOVER_DATA);
    popover = inject(NativePopover);

    showNestedPopover(anchor: View) {
        const config: NativePopoverConfig = {
            anchor,
            data: { message: 'Hello from nested popover!' }
        };
        const popoverRef = this.popover.open(NestedPopoverContentComponent, config);
        popoverRef.afterOpened().subscribe(() => {
            console.log('Nested popover opened');
        });
        popoverRef.afterClosed().subscribe((result) => {
            console.log('Nested popover closed with:', result);
        });
    }
}

@Component({
    selector: 'ns-nested-popover-content',
    standalone: true,
    template: `
        <StackLayout padding="15" android:borderColor="blue" android:borderRadius="5" android:borderWidth="1" android:backgroundColor="#eef">
            <Label text="This is a nested popover!"></Label>
            <Button text="Close" native-popover-close="closed nested"></Button>
        </StackLayout>
    `,
    imports: [NativePopoverCloseDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NestedPopoverContentComponent {}

@Component({
    selector: 'ns-popover-advanced',
    standalone: true,
    template: `
        <StackLayout padding="20">
            <Button #anchor (tap)="showPopover(anchor)">Show Advanced Popover</Button>
        </StackLayout>
    `,
    imports: [NativePopoverModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AdvancedPopoverComponent {
    popover = inject(NativePopover);

    showPopover(anchor: View) {
        const config: NativePopoverConfig = {
            anchor,
            data: { message: 'Hello from advanced popover!' }
        };
        const popoverRef = this.popover.open(PopoverContentComponent, config);
        popoverRef.afterOpened().subscribe(() => {
            console.log('Popover opened with provided anchor');
        });
        popoverRef.beforeClosed().subscribe(() => {
            console.log('Popover about to close');
        });
        popoverRef.afterClosed().subscribe((result) => {
            console.log('Popover closed with:', result);
        });
    }
}
