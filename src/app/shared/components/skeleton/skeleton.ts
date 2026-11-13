import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/* ==========================================================================
   SKELETON TYPES
   ========================================================================== */

export type SkeletonVariant = 'text' | 'rectangle' | 'rounded' | 'circle';

export type SkeletonSize = 'small' | 'medium' | 'large';

export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

/* ==========================================================================
   SKELETON COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-skeleton',
  standalone: false,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  /* =========================================================================
     APPEARANCE
     ========================================================================= */

  readonly variant = input<SkeletonVariant>('text');

  readonly size = input<SkeletonSize>('medium');

  readonly animation = input<SkeletonAnimation>('pulse');

  /* =========================================================================
     DIMENSIONS
     ========================================================================= */

  readonly width = input('100%');

  readonly height = input('');

  /* =========================================================================
     TEXT LINES
     ========================================================================= */

  readonly lines = input(1);

  readonly lastLineWidth = input('75%');

  /* =========================================================================
     ACCESSIBILITY
     ========================================================================= */

  readonly ariaLabel = input('Loading content');

  /* =========================================================================
     COMPUTED VALUES
     ========================================================================= */

  readonly lineCount = computed(() => {
    const count = this.lines();

    if (!Number.isFinite(count)) {
      return 1;
    }

    return Math.min(20, Math.max(1, Math.floor(count)));
  });

  readonly lineIndexes = computed(() =>
    Array.from({ length: this.lineCount() }, (_, index) => index),
  );
}
