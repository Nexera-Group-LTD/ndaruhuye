import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/* ==========================================================================
   BADGE TYPES
   ========================================================================== */

export type BadgeColor =
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

export type BadgeAppearance = 'solid' | 'soft' | 'outline';

export type BadgeSize = 'small' | 'medium' | 'large';

/* ==========================================================================
   BADGE COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-badge',
  standalone: false,
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  /* Appearance */

  @Input()
  color: BadgeColor = 'neutral';

  @Input()
  appearance: BadgeAppearance = 'soft';

  @Input()
  size: BadgeSize = 'medium';

  /* Shape */

  @Input()
  pill = true;

  /* Optional indicator */

  @Input()
  dot = false;

  /* Accessibility */

  @Input()
  ariaLabel?: string;
}
