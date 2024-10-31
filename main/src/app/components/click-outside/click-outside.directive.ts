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
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[paimonClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  // id or className
  @Input() skipSelectors: string[] = [];
  @Output() clickOutsideChange = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick($event: MouseEvent, targetElement: HTMLDivElement): void {
    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    // if need to skip elements with specific selectors
    const isSkipped = this.skipSelectors.some(
      selector => targetElement.classList.contains(selector) || targetElement.id === selector
    );
    if (!isClickedInside && !isSkipped) {
      this.clickOutsideChange.emit();
    }
  }
}
