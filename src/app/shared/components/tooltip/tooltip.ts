import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

/* ==========================================================================
   TYPES
   ========================================================================== */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export type TooltipAppearance = 'dark' | 'light' | 'theme';

export type TooltipSize = 'small' | 'medium' | 'large';

/* ==========================================================================
   COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-tooltip',
  standalone: false,
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip {
  /* =========================================================================
     CONTENT
     ========================================================================= */

  /**
   * Stable, unique ID used by aria-describedby.
   */
  @Input({ required: true })
  tooltipId!: string;

  @Input()
  text = '';

  /* =========================================================================
     APPEARANCE
     ========================================================================= */

  @Input()
  position: TooltipPosition = 'top';

  @Input()
  appearance: TooltipAppearance = 'dark';

  @Input()
  size: TooltipSize = 'medium';

  @Input({ transform: booleanAttribute })
  arrow = true;

  @Input({ transform: booleanAttribute })
  disabled = false;

  /* =========================================================================
     INTERACTION STATE
     ========================================================================= */

  private pointerInside = false;
  private focusInside = false;
  private dismissed = false;

  get isOpen(): boolean {
    return (
      !this.disabled &&
      !!this.text.trim() &&
      !this.dismissed &&
      (this.pointerInside || this.focusInside)
    );
  }

  /* =========================================================================
     POINTER
     ========================================================================= */

  onPointerEnter(): void {
    this.pointerInside = true;
    this.dismissed = false;
  }

  onPointerLeave(): void {
    this.pointerInside = false;

    if (!this.focusInside) {
      this.dismissed = false;
    }
  }

  /* =========================================================================
     FOCUS
     ========================================================================= */

  onFocusIn(): void {
    this.focusInside = true;
    this.dismissed = false;
  }

  onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget;

    if (!(host instanceof HTMLElement)) {
      this.focusInside = false;
      this.dismissed = false;
      return;
    }

    const next = event.relatedTarget;

    if (next instanceof Node && host.contains(next)) {
      return;
    }

    this.focusInside = false;

    if (!this.pointerInside) {
      this.dismissed = false;
    }
  }

  /* =========================================================================
     ESCAPE
     ========================================================================= */

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.isOpen) {
      return;
    }

    event.stopPropagation();
    this.dismissed = true;
  }
}
