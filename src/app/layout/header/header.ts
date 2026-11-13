import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeService } from '../../core/services/theme.service';
import { ThemeColor } from '../../core/models/theme.model';

/* ==========================================================================
   TYPES
   ========================================================================== */

type SectionId = 'home' | 'impact' | 'projects' | 'experience' | 'capabilities' | 'contact';

interface NavigationItem {
  label: string;
  route: string;
  fragment?: SectionId;
  mobileLabel?: string;
}

interface ColorThemeOption {
  value: ThemeColor;
  label: string;
  description: string;
}

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const SECTION_IDS: readonly SectionId[] = [
  'home',
  'impact',
  'projects',
  'experience',
  'capabilities',
  'contact',
];

const DESKTOP_BREAKPOINT = '(min-width: 64rem)';

/* ==========================================================================
   COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements AfterViewInit {
  /* =========================================================================
     DEPENDENCIES
     ========================================================================= */

  readonly theme = inject(ThemeService);

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /* =========================================================================
     ELEMENT REFERENCES
     ========================================================================= */

  @ViewChild('menuButton')
  private menuButton?: ElementRef<HTMLButtonElement>;

  @ViewChild('mobileNavigation')
  private mobileNavigation?: ElementRef<HTMLElement>;

  @ViewChild('colorPicker')
  private colorPicker?: ElementRef<HTMLElement>;

  @ViewChild('colorButton')
  private colorButton?: ElementRef<HTMLButtonElement>;

  /* =========================================================================
     STATE
     ========================================================================= */

  readonly menuOpen = signal(false);
  readonly colorMenuOpen = signal(false);

  readonly activeSection = signal<SectionId>('home');

  readonly currentUrl = signal(this.router.url);

  /* =========================================================================
     NAVIGATION
     ========================================================================= */

  readonly navigationItems: readonly NavigationItem[] = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Projects', route: '/projects' },
    { label: 'Skills', route: '/skills' },
    { label: 'Services', route: '/services' },
    { label: 'Contact', route: '/contact' },
  ];

  readonly contactNavigation: NavigationItem = {
    label: 'Contact Ndaruhuye',
    mobileLabel: 'Get in touch',
    route: '/',
    fragment: 'contact',
  };

  /* =========================================================================
     COLOR OPTIONS
     ========================================================================= */

  readonly colorOptions: readonly ColorThemeOption[] = [
    {
      value: 'default',
      label: 'Default',
      description: 'Black & white',
    },
    {
      value: 'blue',
      label: 'Blue',
      description: 'Blue accents',
    },
    {
      value: 'green',
      label: 'Green',
      description: 'Green accents',
    },
  ];

  /* =========================================================================
     PRIVATE REFERENCES
     ========================================================================= */

  private observer?: IntersectionObserver;

  private pendingFrame: number | null = null;

  /* =========================================================================
     INITIALIZATION
     ========================================================================= */

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    /*
     * ThemeService owns all theme preferences.
     * Do not read or write theme storage here.
     */
    this.theme.initialize();

    this.currentUrl.set(this.router.url);

    this.initializeResponsiveNavigation();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);

        this.closeMenu();
        this.closeColorMenu();

        this.scheduleSectionObserver();
      });

    this.scheduleSectionObserver();

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();

      if (this.pendingFrame !== null) {
        this.document.defaultView?.cancelAnimationFrame(this.pendingFrame);
      }
    });
  }

  /* =========================================================================
     LIGHT / DARK MODE
     ========================================================================= */

  toggleTheme(): void {
    /*
     * ThemeService preserves the existing color
     * when the display mode changes.
     */
    this.theme.toggleMode();
  }

  /* =========================================================================
     COLOR THEME
     ========================================================================= */

  selectColorTheme(color: ThemeColor): void {
    /*
     * ThemeService preserves the existing mode
     * when the color changes.
     */
    this.theme.setColorTheme(color);

    this.closeColorMenu(true);
  }

  /* =========================================================================
     COLOR PICKER
     ========================================================================= */

  toggleColorMenu(): void {
    if (this.colorMenuOpen()) {
      this.closeColorMenu();
      return;
    }

    this.closeMenu();

    this.colorMenuOpen.set(true);
  }

  closeColorMenu(restoreFocus = false): void {
    if (!this.colorMenuOpen()) {
      return;
    }

    this.colorMenuOpen.set(false);

    if (restoreFocus && this.isBrowser) {
      this.colorButton?.nativeElement.focus();
    }
  }

  /* =========================================================================
     MOBILE MENU
     ========================================================================= */

  toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      return;
    }

    this.closeColorMenu();

    this.menuOpen.set(true);
  }

  closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) {
      return;
    }

    this.menuOpen.set(false);

    if (restoreFocus && this.isBrowser) {
      this.menuButton?.nativeElement.focus();
    }
  }

  /* =========================================================================
     KEYBOARD
     ========================================================================= */

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.colorMenuOpen()) {
      this.closeColorMenu(true);
      return;
    }

    if (this.menuOpen()) {
      this.closeMenu(true);
    }
  }

  /* =========================================================================
     POINTER OUTSIDE
     ========================================================================= */

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.isBrowser) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (this.colorMenuOpen() && !this.colorPicker?.nativeElement.contains(target)) {
      this.closeColorMenu();
    }

    if (
      this.menuOpen() &&
      !this.mobileNavigation?.nativeElement.contains(target) &&
      !this.menuButton?.nativeElement.contains(target)
    ) {
      this.closeMenu();
    }
  }

  /* =========================================================================
     RESPONSIVE NAVIGATION
     ========================================================================= */

  private initializeResponsiveNavigation(): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow?.matchMedia) {
      return;
    }

    const mediaQuery = browserWindow.matchMedia(DESKTOP_BREAKPOINT);

    const onChange = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        this.closeMenu();
      }
    };

    mediaQuery.addEventListener('change', onChange);

    this.destroyRef.onDestroy(() => {
      mediaQuery.removeEventListener('change', onChange);
    });
  }

  /* =========================================================================
     NAVIGATION ACTIONS
     ========================================================================= */

  handleNavigation(item: NavigationItem): void {
    this.closeMenu();
    this.closeColorMenu();

    if (item.fragment) {
      this.setActiveSection(item.fragment);
    }
  }

  setActiveSection(section: SectionId): void {
    this.activeSection.set(section);
  }

  /* =========================================================================
     ACTIVE NAVIGATION
     ========================================================================= */

  isNavigationActive(item: NavigationItem): boolean {
    const currentPath = this.getCurrentPath();
    const itemPath = this.normalizeRoute(item.route);

    if (currentPath !== itemPath) {
      return false;
    }

    if (item.fragment) {
      return this.activeSection() === item.fragment;
    }

    return true;
  }

  /* =========================================================================
     SECTION OBSERVER
     ========================================================================= */

  private scheduleSectionObserver(): void {
    if (!this.isBrowser) {
      return;
    }

    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      return;
    }

    if (this.pendingFrame !== null) {
      browserWindow.cancelAnimationFrame(this.pendingFrame);
    }

    this.pendingFrame = browserWindow.requestAnimationFrame(() => {
      this.pendingFrame = null;
      this.setupSectionObserver();
    });
  }

  private setupSectionObserver(): void {
    if (!this.isBrowser) {
      return;
    }

    this.observer?.disconnect();
    this.observer = undefined;

    if (!this.isHomeRoute()) {
      return;
    }

    this.syncActiveSectionFromUrl();

    const browserWindow = this.document.defaultView;

    if (!browserWindow || !('IntersectionObserver' in browserWindow)) {
      return;
    }

    const sections = SECTION_IDS.map((id) => this.document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (!sections.length) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleSection && this.isSectionId(visibleSection.target.id)) {
          this.setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: '-18% 0px -70% 0px',
        threshold: [0, 0.2, 0.5],
      },
    );

    sections.forEach((section) => {
      this.observer?.observe(section);
    });
  }

  /* =========================================================================
     FRAGMENT SYNCHRONIZATION
     ========================================================================= */

  private syncActiveSectionFromUrl(): void {
    if (!this.isBrowser) {
      return;
    }

    const fragment = this.document.defaultView?.location.hash.slice(1) ?? '';

    if (this.isSectionId(fragment)) {
      this.setActiveSection(fragment);
      return;
    }

    this.setActiveSection('home');
  }

  /* =========================================================================
     ROUTE HELPERS
     ========================================================================= */

  private getCurrentPath(): string {
    const url = this.currentUrl() || this.router.url;

    const path = url.split('#')[0].split('?')[0];

    return this.normalizeRoute(path);
  }

  private normalizeRoute(route: string): string {
    if (!route || route === '/') {
      return '/';
    }

    const normalized = route.startsWith('/') ? route : `/${route}`;

    return normalized.replace(/\/+$/, '');
  }

  private isHomeRoute(): boolean {
    return this.getCurrentPath() === '/';
  }

  private isSectionId(value: string): value is SectionId {
    return SECTION_IDS.includes(value as SectionId);
  }
}
