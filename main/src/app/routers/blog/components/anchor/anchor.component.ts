import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID
} from '@angular/core';
import { TOC } from '@paimon-markdown-parser/article';
import { isPlatformBrowser, NgClass, ViewportScroller } from '@angular/common';
import GithubSlugger from 'github-slugger';

const githubSlugger = new GithubSlugger();

type DomObj = Record<string, number>;
@Component({
  selector: 'paimon-anchor',
  standalone: true,
  imports: [NgClass],
  templateUrl: './anchor.component.html',
  styleUrl: './anchor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorComponent implements OnChanges {
  @Input() links: TOC[] = [];
  @Input() classNames = 'top-6';

  container?: HTMLElement | Window;
  highLightId?: string | null;
  io?: IntersectionObserver;
  domShow: DomObj = {};

  constructor(
    private viewportScroller: ViewportScroller,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  scrollTo(id: string | null, title: string): void {
    const convertId = id || githubSlugger.slug(title);
    this.viewportScroller.setOffset([0, 84]);
    this.viewportScroller.scrollToAnchor(convertId);
  }

  observe(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.io?.disconnect();
      this.io = new IntersectionObserver(
        entries => {
          for (const entre of entries) {
            this.domShow[entre.target.id] = entre.intersectionRatio;
          }
          const highlightItem = this.links.find(item => item.id && this.domShow[item.id] > 0);
          if (highlightItem) {
            this.highLightId = highlightItem.id;
          }
          this.cdr.markForCheck();
        },
        {
          threshold: [0, 0.5, 1],
          rootMargin: '-60px 0px'
        }
      );
      this.links.forEach(item => {
        if (isPlatformBrowser(this.platformId) && window?.document) {
          const element = document.getElementById(item.id!);
          if (element) {
            this.io?.observe(element);
          }
        }
      });
    }
  }

  ngOnChanges(): void {
    this.observe();
  }
}
