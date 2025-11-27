import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NativePopoverModalRef } from './native-popover-modal-ref';

// Counter for unique popover ids.
let uniqueId = 0;

/** Possible states of the lifecycle of a popover. */
export const enum NativePopoverState {
    OPEN,
    CLOSING,
    CLOSED
}

export class NativePopoverRef<T, R = any> {
    /** The instance of component opened into the popover. */
    componentInstance: T;

    /** Subject for notifying the user that the popover has finished opening. */
    private readonly _afterOpened = new Subject<void>();

    /** Subject for notifying the user that the popover has finished closing. */
    private readonly _afterClosed = new Subject<R | undefined>();

    /** Subject for notifying the user that the popover has started closing. */
    private readonly _beforeClosed = new Subject<R | undefined>();

    /** Result to be passed to afterClosed. */
    private _result: R | undefined;

    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    private _closeFallbackTimeout: any;

    /** Current state of the popover. */
    private _state = NativePopoverState.OPEN;

    constructor(
        private _nativePopoverModalRef: NativePopoverModalRef,
        readonly id: string = `native-popover-${uniqueId++}`
    ) {
        // Pass the id along to the modal ref.
        _nativePopoverModalRef._id = id;

        // Emit when opening animation completes
        _nativePopoverModalRef.stateChanged
            .pipe(
                filter((event) => event.state === 'opened'),
                take(1)
            )
            .subscribe(() => {
                this._afterOpened.next();
                this._afterOpened.complete();
            });

        // Dispose when closing animation is complete
        _nativePopoverModalRef.stateChanged
            .pipe(
                filter((event) => event.state === 'closed'),
                take(1)
            )
            .subscribe(() => {
                clearTimeout(this._closeFallbackTimeout);
                this._finishPopoverClose();
                this._afterClosed.next(this._result);
                this._afterClosed.complete();
            });

        _nativePopoverModalRef.onDismiss.subscribe(() => {
            this._beforeClosed.next(this._result);
            this._beforeClosed.complete();
            this.componentInstance = null!;
        });
    }

    /**
     * Close the popover.
     * @param popoverResult Optional result to return to the popover opener.
     */
    close(popoverResult?: R): void {
        this._result = popoverResult;

        // Transition the backdrop in parallel to the popover.
        this._nativePopoverModalRef.stateChanged
            .pipe(
                filter((event) => event.state === 'closing'),
                take(1)
            )
            .subscribe(() => {
                this._beforeClosed.next(popoverResult);
                this._beforeClosed.complete();

                // Cleanup if the popover does not emit the expected event within the specified time plus 100ms.
                this._closeFallbackTimeout = setTimeout(() => {
                    this._finishPopoverClose();
                    this._afterClosed.next(this._result);
                    this._afterClosed.complete();
                }, 100);
            });

        this._state = NativePopoverState.CLOSING;
        this._nativePopoverModalRef._closeCallback();
    }

    /**
     * Gets an observable that is notified when the popover is finished opening.
     */
    afterOpened(): Observable<void> {
        return this._afterOpened;
    }

    /**
     * Gets an observable that is notified when the popover is finished closing.
     */
    afterClosed(): Observable<R | undefined> {
        return this._afterClosed;
    }

    /**
     * Gets an observable that is notified when the popover has started closing.
     */
    beforeClosed(): Observable<R | undefined> {
        return this._beforeClosed;
    }

    /** Gets the current state of the popover's lifecycle. */
    getState(): NativePopoverState {
        return this._state;
    }

    /**
     * Finishes the popover close by updating the state of the popover
     * and disposing the modal ref.
     */
    private _finishPopoverClose() {
        this._state = NativePopoverState.CLOSED;
    }
}
