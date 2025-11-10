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
import { DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { fromEvent, startWith } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

import { ClickOutsideDirective } from '@paimon/app/components/click-outside/click-outside.directive';
import { CommunityDropdownComponent } from '@paimon/app/components/community-dropdown/community-dropdown.component';
import { SearchBarComponent } from '@paimon/app/components/search-bar/search-bar.component';
import { DividerComponent, DropdownLinksComponent } from '@paimon/app/components/ui-components';
import { SwitcherComponent } from '@paimon/app/components/ui-components/components/switcher/switcher.component';
import { DocumentService } from '@paimon/app/services/document.service';
import { Language, LanguageService } from '@paimon/app/services/language.service';

@Component({
  selector: 'paimon-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ClickOutsideDirective,
    DividerComponent,
    SwitcherComponent,
    FormsModule,
    TranslateModule,
    DropdownLinksComponent,
    RouterLink,
    CommunityDropdownComponent,
    SearchBarComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  language: Language;
  destroyRef = inject(DestroyRef);
  expandedMenu: string;
  @ViewChild('header', { static: true }) private headerElement: ElementRef;

  private readonly platformId = inject(PLATFORM_ID);
  private _doc = inject(DOCUMENT);
  readonly versions = [
    {
      label: 'master',
      value: 'https://paimon.apache.org/docs/master'
    },
    {
      label: '1.3',
      value: 'https://paimon.apache.org/docs/1.3'
    },
    {
      label: '1.2',
      value: 'https://paimon.apache.org/docs/1.2'
    },
    {
      label: '1.1',
      value: 'https://paimon.apache.org/docs/1.1'
    }
  ];

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private documentService: DocumentService
  ) {}

  protected get latestReleaseVersion(): string {
    return this.documentService.latestVersion;
  }

  private getWindow(): Window | null {
    return this._doc.defaultView;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.getWindow()!, 'scroll')
        .pipe(startWith(true), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const isScrolled = this.getWindow()?.scrollY || this._doc.documentElement.scrollTop;
          if (isScrolled > 0) {
            this.headerElement.nativeElement.classList.remove('bg-transparent');
            this.headerElement.nativeElement.classList.add('bg-paimon-gray-14');
          } else {
            this.headerElement.nativeElement.classList.remove('bg-paimon-gray-14');
            this.headerElement.nativeElement.classList.add('bg-transparent');
          }
        });

      this.language = this.languageService.language;
      this.cdr.markForCheck();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.el.nativeElement.classList.toggle('menu-open');
    this.cdr.markForCheck();
  }

  hideMenu(): void {
    this.isMenuOpen = false;
    this.el.nativeElement.classList.remove('menu-open');
    this.cdr.markForCheck();
  }

  languageChange(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

  toggleMobileMenus(menu: string): void {
    if (this.expandedMenu === menu) {
      this.expandedMenu = '';
    } else {
      this.expandedMenu = menu;
    }
    this.cdr.markForCheck();
  }
}
