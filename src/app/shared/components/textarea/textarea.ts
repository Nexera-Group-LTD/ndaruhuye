import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';

export type TextareaSize = 'small' | 'medium' | 'large';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

@Component({
  selector: 'app-textarea',
  standalone: false,
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements ControlValueAccessor, Validator, OnInit, OnChanges {
  /* ==============================================================
     INPUTS
     ============================================================== */

  readonly inputId = input.required<string>();

  readonly name = input('');
  readonly label = input('');
  readonly ariaLabel = input('');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input('');

  readonly errorMessages = input<Readonly<Record<string, string>>>({});

  readonly size = input<TextareaSize>('medium');
  readonly resize = input<TextareaResize>('vertical');

  readonly rows = input(4);
  readonly minLength = input<number | null>(null);
  readonly maxLength = input<number | null>(null);

  readonly autocomplete = input('off');

  readonly required = input(false, {
    transform: booleanAttribute,
  });

  readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  readonly readonly = input(false, {
    transform: booleanAttribute,
  });

  readonly showErrors = input(false, {
    transform: booleanAttribute,
  });

  readonly showCount = input(false, {
    transform: booleanAttribute,
  });

  /* ==============================================================
     OUTPUTS
     ============================================================== */

  readonly valueChange = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  /* ==============================================================
     STATE
     ============================================================== */

  readonly currentValue = signal('');
  readonly touched = signal(false);

  private readonly formDisabled = signal(false);

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  private ngControl: NgControl | null = null;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private validatorChanged: () => void = () => {};

  /* ==============================================================
     LIFECYCLE
     ============================================================== */

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true });

    this.ngControl?.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnChanges(): void {
    this.validatorChanged();
  }

  /* ==============================================================
     GETTERS
     ============================================================== */

  get isDisabled(): boolean {
    return this.disabled() || this.formDisabled();
  }

  get controlName(): string {
    return this.name() || this.inputId();
  }

  /**
   * Native maxlength and Angular Validators.maxLength
   * both use JavaScript string length.
   */
  get characterCount(): number {
    return this.currentValue().length;
  }

  get message(): string {
    if (this.isDisabled) {
      return '';
    }

    if (this.error()) {
      return this.error();
    }

    const control = this.ngControl?.control;

    const shouldShow =
      this.showErrors() || !!control?.touched || !!control?.dirty || (!control && this.touched());

    if (!shouldShow) {
      return '';
    }

    const errors =
      control?.errors ??
      this.validate({
        value: this.currentValue(),
      } as AbstractControl);

    if (!errors) {
      return '';
    }

    const key = Object.keys(errors)[0];

    if (!key) {
      return '';
    }

    const custom = this.errorMessages()[key];

    if (custom) {
      return custom;
    }

    switch (key) {
      case 'required':
        return 'This field is required.';

      case 'minlength':
        return `Enter at least ${errors[key].requiredLength} characters.`;

      case 'maxlength':
        return `Enter no more than ${errors[key].requiredLength} characters.`;

      default:
        return 'Please check this value.';
    }
  }

  get describedBy(): string | null {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.inputId()}-hint`);
    }

    if (this.message) {
      ids.push(`${this.inputId()}-error`);
    }

    if (this.showCount()) {
      ids.push(`${this.inputId()}-count`);
    }

    return ids.join(' ') || null;
  }

  /* ==============================================================
     CONTROL VALUE ACCESSOR
     ============================================================== */

  writeValue(value: string | null | undefined): void {
    this.currentValue.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    this.cdr.markForCheck();
  }

  /* ==============================================================
     VALIDATION
     ============================================================== */

  validate(control: AbstractControl): ValidationErrors | null {
    const validators = [];

    if (this.required()) {
      validators.push(Validators.required);
    }

    if (this.minLength() !== null) {
      validators.push(Validators.minLength(this.minLength()!));
    }

    if (this.maxLength() !== null) {
      validators.push(Validators.maxLength(this.maxLength()!));
    }

    return Validators.compose(validators)?.(control) ?? null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }

  /* ==============================================================
     INTERACTION
     ============================================================== */

  update(event: Event): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    this.currentValue.set(value);

    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.touched.set(true);

    this.onTouched();
    this.blurred.emit(event);
  }
}
