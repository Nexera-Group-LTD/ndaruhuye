import {
  afterEveryRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  viewChild,
} from '@angular/core';

/* ==========================================================================
   MODAL TYPES
   ========================================================================== */

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export type ModalRole = 'dialog' | 'alertdialog';

/* ==========================================================================
   MODAL COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  /* =========================================================================
     CONFIGURATION
     ========================================================================= */

  /**
   * Unique identifier used for accessible labels.
   * Provide a stable value for SSR compatibility.
   */
  @Input({ required: true })
  modalId!: string;

  /**
   * Controlled visibility state.
   *
   * Supports [(open)] two-way binding.
   */
  @Input({ transform: booleanAttribute })
  open = false;

  @Output()
  readonly openChange = new EventEmitter<boolean>();

  /**
   * Optional heading and description.
   */
  @Input()
  title = '';

  @Input()
  description = '';

  @Input()
  ariaLabel = 'Dialog';

  /**
   * Dialog appearance.
   */
  @Input()
  size: ModalSize = 'medium';

  @Input()
  role: ModalRole = 'dialog';

  /**
   * Dismissal options.
   */
  @Input({ transform: booleanAttribute })
  dismissible = true;

  @Input({ transform: booleanAttribute })
  closeOnBackdrop = true;

  @Input({ transform: booleanAttribute })
  closeOnEscape = true;

  @Input({ transform: booleanAttribute })
  showCloseButton = true;

  /**
   * Prevent closing while a critical action is running.
   */
  @Input({ transform: booleanAttribute })
  busy = false;

  /* =========================================================================
     EVENTS
     ========================================================================= */

  /**
   * Fired after the native dialog closes.
   */
  @Output()
  readonly closed = new EventEmitter<void>();

  /* =========================================================================
     VIEW REFERENCES
     ========================================================================= */

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  /* =========================================================================
     LIFECYCLE
     ========================================================================= */

  constructor() {
    /**
     * afterEveryRender only runs in the browser.
     * This avoids manipulating <dialog> during SSR.
     */
    afterEveryRender(() => {
      const dialog = this.dialogRef()?.nativeElement;

      if (!dialog) {
        return;
      }

      if (this.open && !dialog.open) {
        dialog.showModal();
      } else if (!this.open && dialog.open) {
        dialog.close();
      }
    });
  }

  /* =========================================================================
     STATE
     ========================================================================= */

  get canDismiss(): boolean {
    return this.dismissible && !this.busy;
  }

  /* =========================================================================
     PUBLIC CLOSE METHOD
     ========================================================================= */

  close(): void {
    this.requestClose();
  }

  /* =========================================================================
     REQUEST CLOSE
     ========================================================================= */

  private requestClose(): void {
    if (!this.canDismiss || !this.open) {
      return;
    }

    /**
     * The parent updates the open input through
     * [(open)] or (openChange).
     */
    this.openChange.emit(false);
  }

  /* =========================================================================
     ESCAPE KEY
     ========================================================================= */

  onCancel(event: Event): void {
    event.preventDefault();

    if (!this.closeOnEscape) {
      return;
    }

    this.requestClose();
  }

  /* =========================================================================
     BACKDROP CLICK
     ========================================================================= */

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop || !this.canDismiss) {
      return;
    }

    const dialog = this.dialogRef()?.nativeElement;

    if (!dialog || event.target !== dialog) {
      return;
    }

    this.requestClose();
  }

  /* =========================================================================
     NATIVE CLOSE EVENT
     ========================================================================= */

  onNativeClose(): void {
    /**
     * Keep the input and native state synchronized,
     * including unexpected native closures.
     */
    if (this.open) {
      this.openChange.emit(false);
    }

    this.closed.emit();
  }
}
