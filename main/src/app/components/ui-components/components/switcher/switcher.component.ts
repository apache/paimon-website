/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface SwitcherOption {
  label: string;
  value: string;
}

@Component({
  selector: 'paimon-switcher',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './switcher.component.html',
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
