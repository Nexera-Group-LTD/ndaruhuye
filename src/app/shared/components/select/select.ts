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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/* ==========================================================================
   SELECT TYPES
   ========================================================================== */

export type SelectSize = 'small' | 'medium' | 'large';

export type SelectValue = string | null;

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/* ==========================================================================
   SELECT COMPONENT
   ========================================================================== */

@Component({
  selector: 'app-select',
  standalone: false,
  templateUrl: './select.html',
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor, Validator, OnInit, OnChanges {
  /* =========================================================================
     CONFIGURATION
     ========================================================================= */

  readonly inputId = input.required<string>();

  readonly name = input('');
  readonly label = input('');
  readonly ariaLabel = input('');

  readonly placeholder = input('Select an option');

  readonly hint = input('');
  readonly error = input('');

  readonly errorMessages = input<Readonly<Record<string, string>>>({});

  readonly options = input<readonly SelectOption[]>([]);

  readonly size = input<SelectSize>('medium');

  readonly prefixIcon = input('');

  /* =========================================================================
     STATE INPUTS
     ========================================================================= */

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

  /* =========================================================================
     EVENTS
     ========================================================================= */

  readonly valueChange = output<SelectValue>();

  readonly focused = output<FocusEvent>();

  readonly blurred = output<FocusEvent>();

  /* =========================================================================
     INTERNAL STATE
     ========================================================================= */

  readonly currentValue = signal<SelectValue>(null);

  readonly touched = signal(false);

  private readonly formDisabled = signal(false);

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  private ngControl: NgControl | null = null;

  private onChange: (value: SelectValue) => void = () => {};
  private onTouched: () => void = () => {};
  private validatorChanged: () => void = () => {};

  /* =========================================================================
     LIFECYCLE
     ========================================================================= */

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true });

    this.ngControl?.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(): void {
    this.validatorChanged();
  }

  /* =========================================================================
     GETTERS
     ========================================================================= */

  get isDisabled(): boolean {
    return this.disabled() || this.formDisabled();
  }

  get isReadonly(): boolean {
    return this.readonly();
  }

  get isNonInteractive(): boolean {
    return this.isDisabled || this.isReadonly;
  }

  get controlName(): string {
    return this.name() || this.inputId();
  }

  get displayedValue(): string {
    return this.currentValue() ?? '';
  }

  /* =========================================================================
     VALIDATION MESSAGE
     ========================================================================= */

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

    const errors = control?.errors;

    if (!errors) {
      if (this.required() && !this.currentValue()) {
        return 'Please select an option.';
      }

      return '';
    }

    const key = Object.keys(errors)[0];

    if (!key) {
      return '';
    }

    const customMessage = this.errorMessages()[key];

    if (customMessage) {
      return customMessage;
    }

    switch (key) {
      case 'required':
        return 'Please select an option.';

      default:
        return 'Please check your selection.';
    }
  }

  /* =========================================================================
     ACCESSIBILITY
     ========================================================================= */

  get describedBy(): string | null {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.inputId()}-hint`);
    }

    if (this.message) {
      ids.push(`${this.inputId()}-error`);
    }

    return ids.length ? ids.join(' ') : null;
  }

  /* =========================================================================
     CONTROL VALUE ACCESSOR
     ========================================================================= */

  writeValue(value: SelectValue | undefined): void {
    this.currentValue.set(value ?? null);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: SelectValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(value: boolean): void {
    this.formDisabled.set(value);
    this.cdr.markForCheck();
  }

  /* =========================================================================
     VALIDATOR
     ========================================================================= */

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.required()) {
      return null;
    }

    return Validators.required(control);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }

  /* =========================================================================
     VALUE UPDATE
     ========================================================================= */

  update(event: Event): void {
    if (this.isNonInteractive) {
      return;
    }

    const element = event.target as HTMLSelectElement;

    const value: SelectValue = element.value === '' ? null : element.value;

    this.currentValue.set(value);

    this.onChange(value);
    this.valueChange.emit(value);
  }

  /* =========================================================================
     FOCUS
     ========================================================================= */

  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.touched.set(true);

    this.onTouched();
    this.blurred.emit(event);
  }
}
