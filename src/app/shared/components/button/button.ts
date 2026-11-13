import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/* ==========================================================================
   BUTTON TYPES
   ========================================================================== */

export type ButtonColor =
  | 'primary'
  | 'neutral'
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'teal'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type ButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonType = 'button' | 'submit' | 'reset';

/* ==========================================================================
   BUTTON COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  /* Appearance */

  @Input()
  color: ButtonColor = 'primary';

  @Input()
  appearance: ButtonAppearance = 'solid';

  @Input()
  size: ButtonSize = 'medium';

  /* Native button type */

  @Input()
  type: ButtonType = 'button';

  /* Interaction */

  @Input()
  disabled = false;

  @Input()
  loading = false;

  /* Layout */

  @Input()
  fullWidth = false;

  @Input()
  iconOnly = false;

  /* Accessibility */

  @Input()
  ariaLabel?: string;

  @Input()
  loadingLabel = 'Loading';

  /* Form attributes */

  @Input()
  name?: string;

  @Input()
  value?: string;

  /* Events */

  @Output()
  readonly buttonClick = new EventEmitter<MouseEvent>();

  /* ==========================================================================
     COMPUTED INTERACTION STATE
     ========================================================================== */

  get interactionDisabled(): boolean {
    return this.disabled || this.loading;
  }

  /* ==========================================================================
     CLICK HANDLER
     ========================================================================== */

  handleClick(event: MouseEvent): void {
    if (this.interactionDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}
