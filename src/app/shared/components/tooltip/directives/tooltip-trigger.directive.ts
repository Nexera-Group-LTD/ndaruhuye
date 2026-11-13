import { Directive, ElementRef, HostBinding, inject } from '@angular/core';

import { Tooltip } from '../tooltip';

@Directive({
  selector: '[appTooltipTrigger]',
  standalone: false,
})
export class TooltipTriggerDirective {
  private readonly tooltip = inject(Tooltip);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly existingDescription =
    this.element.nativeElement.getAttribute('aria-describedby') ?? '';

  @HostBinding('attr.aria-describedby')
  get describedBy(): string {
    const ids = [...this.existingDescription.split(/\s+/), this.tooltip.tooltipId].filter(Boolean);

    return [...new Set(ids)].join(' ');
  }
}
