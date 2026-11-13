import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type LoaderSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.html',
  styleUrl: './loader.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loader {
  /**
   * Controls the spinner dimensions.
   */
  @Input()
  size: LoaderSize = 'medium';

  /**
   * Accessible loading description.
   */
  @Input()
  label = 'Loading';

  /**
   * false: inherit the parent's text color.
   * true: use the active theme's primary color.
   */
  @Input()
  primary = false;
}
