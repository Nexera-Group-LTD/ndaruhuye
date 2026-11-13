import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/* ==========================================================================
   DIVIDER TYPES
   ========================================================================== */

export type DividerOrientation = 'horizontal' | 'vertical';

export type DividerAppearance = 'solid' | 'dashed' | 'dotted';

export type DividerColor = 'default' | 'subtle' | 'strong' | 'primary';

export type DividerThickness = 'thin' | 'medium' | 'thick';

export type DividerSpacing = 'none' | 'small' | 'medium' | 'large';

/* ==========================================================================
   DIVIDER COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-divider',
  standalone: false,
  templateUrl: './divider.html',
  styleUrl: './divider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.divider-host--vertical]': 'orientation === "vertical"',
  },
})
export class Divider {
  /* Direction */

  @Input()
  orientation: DividerOrientation = 'horizontal';

  /* Appearance */

  @Input()
  appearance: DividerAppearance = 'solid';

  @Input()
  color: DividerColor = 'default';

  @Input()
  thickness: DividerThickness = 'thin';

  /* Spacing */

  @Input()
  spacing: DividerSpacing = 'medium';

  /* Optional label */

  @Input()
  label = '';

  /* Accessibility */

  @Input()
  decorative = true;
}
