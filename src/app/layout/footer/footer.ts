import { isPlatformBrowser } from '@angular/common';

import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentYear = new Date().getFullYear();

  readonly navigationItems = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Projects', route: '/projects' },
    { label: 'Skills', route: '/skills' },
    { label: 'Services', route: '/services' },
    { label: 'Contact', route: '/contact' },
  ] as const;

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  }
}
