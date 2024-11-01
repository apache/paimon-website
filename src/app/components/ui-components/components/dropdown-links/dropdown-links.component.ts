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
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DropdownOption {
  label: string;
  value: string | string[];
  target?: string;
}

@Component({
  selector: 'paimon-dropdown-links',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './dropdown-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    ngSkipHydration: 'true'
  }
})
export class DropdownLinksComponent {
  @Input() options: DropdownOption[] = [];

  protected isRouterLink(value: string | string[]): boolean {
    return Array.isArray(value);
  }
}
