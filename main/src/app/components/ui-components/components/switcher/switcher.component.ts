import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface SwitcherOption {
  label: string;
  value: string;
}
@Component({
  selector: 'paimon-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SwitcherComponent
    }
  ]
})
export class SwitcherComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() options: SwitcherOption[] = [];
  constructor(private cdr: ChangeDetectorRef) {}

  formControl = new FormControl<string>('');
  private destroy$ = new Subject<void>();

  get isLast(): boolean {
    return this.options.findIndex(v => v.value === this.formControl.value) === this.options.length - 1;
  }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.fnChange(value || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // NG_VALUE_ACCESSOR
  writeValue(value: string): void {
    this.formControl.setValue(value, { emitEvent: false });
  }
  fnChange: (v: string) => void = () => void 0;
  fnTouched: () => void = () => void 0;
  registerOnChange(fn: (v: string) => void): void {
    this.fnChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.fnTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.formControl.disable({ emitEvent: false });
    } else {
      this.formControl.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }
}
