import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { NATIVE_POPOVER_DATA, NativePopover, NativePopoverCloseDirective, NativePopoverConfig, NativePopoverModule } from '@nativescript-community/ui-popover/angular';
import { View } from '@nativescript/core';

@Component({
    selector: 'ns-popover-content',
    standalone: true,
    template: `
        <StackLayout padding="20" borderColor="black" borderRadius="5" borderWidth="1" backgroundColor="white">
            <Label>data: {{ data?.message }}</Label>
            <Button text="Close" native-popover-close="closed with button"></Button>
        </StackLayout>
    `,
    imports: [NativePopoverCloseDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PopoverContentComponent {
    data = inject(NATIVE_POPOVER_DATA);
}

@Component({
    selector: 'ns-basic-popover',
    standalone: true,
    template: `
        <StackLayout padding="20">
            <Button #anchor (tap)="showPopover(anchor)">Show Popover</Button>

            <StackLayout padding="20" backgroundColor="red" height="100" width="100"></StackLayout>
        </StackLayout>
    `,
    imports: [NativePopoverModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class BasicPopoverComponent {
    popover = inject(NativePopover);

    showPopover(anchor: View) {
        const config: NativePopoverConfig = {
            anchor,
            data: { message: 'Hello from provided anchor!' }
        };

        const popoverRef = this.popover.open(PopoverContentComponent, config);

        popoverRef.afterOpened().subscribe(
            () => {
                console.log('Popover opened with provided anchor');
            },
            (error) => {
                console.error('Error opening popover:', error);
            },
            () => {
                console.log('Popover afterOpened observable completed');
            }
        );

        popoverRef.beforeClosed().subscribe(() => {
            console.log('Popover about to close');
        });

        popoverRef.afterClosed().subscribe((result) => {
            console.log('Popover closed with:', result);
        });
    }
}
