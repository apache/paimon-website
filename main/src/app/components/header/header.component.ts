import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { ClickOutsideDirective } from '@paimon/app/components/click-outside/click-outside.directive';
import { DividerComponent } from '@paimon/app/components/ui-components';
import { SwitcherComponent } from '@paimon/app/components/ui-components/components/switcher/switcher.component';
import { FormsModule } from '@angular/forms';
import { DropdownLinksComponent } from '@paimon/app/components/ui-components/components/dropdown-links/dropdown-links.component';
import { fromEvent, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  language: Language;
  destroyRef = inject(DestroyRef);

  @ViewChild('header', { static: true }) private headerElement: ElementRef;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    @Inject(DOCUMENT) private _doc: Document
  ) {}

  getWindow(): Window | null {
    return this._doc.defaultView;
  }

  ngOnInit(): void {
    if (this.getWindow()) {
      fromEvent(this.getWindow()!, 'scroll')
        .pipe(startWith(true), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const isScrolled = this.getWindow()?.pageYOffset || this._doc.documentElement.scrollTop;
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
}
