import { Component, inject, NO_ERRORS_SCHEMA, signal, TemplateRef, ViewChild } from '@angular/core';
import { NativePopover, NativePopoverConfig, NativePopoverModule } from '@nativescript-community/ui-popover/angular';
import { View } from '@nativescript/core';

@Component({
    selector: 'ns-popover-templated',
    template: `
        <StackLayout padding="20">
            <Button #anchor (tap)="showPopover(anchor)">Show Templated Popover</Button>
            <Label>Count (signal): {{ count() }}</Label>
            <Label>Count (normal): {{ count2 }}</Label>
        </StackLayout>

        <ng-template #popoverTemplate let-data="data">
            <StackLayout padding="20" borderColor="black" borderRadius="5" borderWidth="1" backgroundColor="white">
                <Label>Data: {{ data?.message }}</Label>
                <Label>Count (signal): {{ count() }}</Label>
                <Label>Count (normal): {{ count2 }}</Label>
                <Button (tap)="updateCount()">Increment Count</Button>
                <Button text="Close" native-popover-close="closed with button"></Button>
            </StackLayout>
        </ng-template>
    `,
    imports: [NativePopoverModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TemplatedPopoverComponent {
    @ViewChild('popoverTemplate', { static: true }) popoverTemplate: TemplateRef<any>;
    popover = inject(NativePopover);
    count = signal(0);
    count2 = 0;

    updateCount() {
        this.count.set(this.count() + 1);
        this.count2 += 1;
    }

    showPopover(anchor: View) {
        const config: NativePopoverConfig = {
            anchor,
            data: { message: 'Hello from templated popover!' }
        };
        const popoverRef = this.popover.open(this.popoverTemplate, config);

        popoverRef.afterOpened().subscribe(() => {
            console.log('Templated Popover opened');
        });

        popoverRef.beforeClosed().subscribe(() => {
            console.log('Templated Popover about to close');
        });

        popoverRef.afterClosed().subscribe((result) => {
            console.log('Templated Popover closed with:', result);
        });
    }
}
