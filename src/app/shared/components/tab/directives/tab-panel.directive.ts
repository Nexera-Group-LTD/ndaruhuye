import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[appTabPanel]',
  standalone: false,
})
export class TabPanelDirective {
  @Input('appTabPanel')
  value = '';

  readonly template = inject(TemplateRef<unknown>);
}
