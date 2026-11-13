import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';

import { TabPanelDirective } from './directives/tab-panel.directive';

/* ==========================================================================
   TYPES
   ========================================================================== */

export type TabAppearance = 'underline' | 'pills' | 'bordered';

export type TabOrientation = 'horizontal' | 'vertical';

export type TabSize = 'small' | 'medium' | 'large';

export interface TabItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-tab',
  standalone: false,
  templateUrl: './tab.html',
  styleUrl: './tab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab implements OnChanges, AfterContentInit {
  /* =========================================================================
     INPUTS
     ========================================================================= */

  @Input({ required: true })
  tabId!: string;

  @Input()
  tabs: readonly TabItem[] = [];

  @Input()
  active: string | null = null;

  @Input()
  appearance: TabAppearance = 'underline';

  @Input()
  orientation: TabOrientation = 'horizontal';

  @Input()
  size: TabSize = 'medium';

  @Input()
  fullWidth = false;

  @Input()
  ariaLabel = 'Tabs';

  /* =========================================================================
     OUTPUTS
     ========================================================================= */

  @Output()
  readonly activeChange = new EventEmitter<string>();

  @Output()
  readonly tabChange = new EventEmitter<string>();

  /* =========================================================================
     PROJECTED PANELS
     ========================================================================= */

  @ContentChildren(TabPanelDirective, {
    descendants: true,
  })
  panels!: QueryList<TabPanelDirective>;

  @ViewChildren('tabButton', {
    read: ElementRef,
  })
  private tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  /* =========================================================================
     DEPENDENCIES
     ========================================================================= */

  private readonly cdr = inject(ChangeDetectorRef);

  /* =========================================================================
     INTERNAL STATE
     ========================================================================= */

  private internalActive: string | null = null;

  /* =========================================================================
     LIFECYCLE
     ========================================================================= */

  ngOnChanges(): void {
    this.internalActive = this.active;
    this.cdr.markForCheck();
  }

  ngAfterContentInit(): void {
    this.cdr.markForCheck();
  }

  /* =========================================================================
     SELECTED TAB
     ========================================================================= */

  get selectedValue(): string | null {
    const requested = this.internalActive;

    const selected = this.tabs.find((tab) => tab.value === requested && !tab.disabled);

    if (selected) {
      return selected.value;
    }

    return this.tabs.find((tab) => !tab.disabled)?.value ?? null;
  }

  get selectedIndex(): number {
    return this.tabs.findIndex((tab) => tab.value === this.selectedValue);
  }

  get panelId(): string {
    return `${this.tabId}-panel`;
  }

  get activePanel(): TabPanelDirective | undefined {
    const selected = this.selectedValue;

    return this.panels?.find((panel) => panel.value === selected);
  }

  /* =========================================================================
     SELECTION
     ========================================================================= */

  selectTab(tab: TabItem): void {
    if (tab.disabled || tab.value === this.selectedValue) {
      return;
    }

    this.internalActive = tab.value;

    this.activeChange.emit(tab.value);
    this.tabChange.emit(tab.value);

    this.cdr.markForCheck();
  }

  /* =========================================================================
     KEYBOARD NAVIGATION
     ========================================================================= */

  onKeydown(event: KeyboardEvent, currentIndex: number): void {
    const horizontal = this.orientation === 'horizontal';

    let direction = 0;

    if (horizontal && event.key === 'ArrowRight') {
      direction = 1;
    } else if (horizontal && event.key === 'ArrowLeft') {
      direction = -1;
    } else if (!horizontal && event.key === 'ArrowDown') {
      direction = 1;
    } else if (!horizontal && event.key === 'ArrowUp') {
      direction = -1;
    }

    const enabledTabs = this.tabs
      .map((tab, index) => ({
        tab,
        index,
      }))
      .filter(({ tab }) => !tab.disabled);

    if (!enabledTabs.length) {
      return;
    }

    let targetIndex: number;

    /* First enabled tab */

    if (event.key === 'Home') {
      targetIndex = enabledTabs[0].index;
    }

    /* Last enabled tab */
    else if (event.key === 'End') {
      targetIndex = enabledTabs[enabledTabs.length - 1].index;
    }

    /* Previous / next enabled tab */
    else if (direction !== 0) {
      const currentPosition = enabledTabs.findIndex(({ index }) => index === currentIndex);

      if (currentPosition === -1) {
        return;
      }

      const nextPosition = (currentPosition + direction + enabledTabs.length) % enabledTabs.length;

      targetIndex = enabledTabs[nextPosition].index;
    } else {
      return;
    }

    event.preventDefault();

    const nextTab = this.tabs[targetIndex];

    if (!nextTab) {
      return;
    }

    this.selectTab(nextTab);

    this.tabButtons.get(targetIndex)?.nativeElement.focus();
  }
}
