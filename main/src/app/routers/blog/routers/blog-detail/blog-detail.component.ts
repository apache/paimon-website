import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { ArticleService } from '@paimon/app/services/article.service';
import { ResolvedArticle, TOC } from '@paimon-markdown-parser/article';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnchorComponent } from '@paimon/app/routers/blog/components/anchor/anchor.component';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, startWith } from 'rxjs';
import { BlogDetailFooterComponent } from '@paimon/app/routers/blog/components/blog-detail-footer/blog-detail-footer.component';

@Component({
  selector: 'paimon-blog-detail',
  standalone: true,
  imports: [RouterLink, AnchorComponent, BlogDetailFooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit {
  article: ResolvedArticle | null = null;
  tocs: TOC[] = [];
  safeContent: SafeHtml | null = null;
  name: string | null = null;

  showAnchor = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private sanitized: DomSanitizer,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ id }) => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      }
      this.articleService.get(id).subscribe(article => {
        this.article = article;
        this.tocs = this.getFlattenTreeFromArticle(article);
        this.safeContent = this.sanitized.bypassSecurityTrustHtml(article.content);
        this.cdr.markForCheck();
      });
    });

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll')
        .pipe(startWith(true), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const offsetY = window.scrollY || document.documentElement.scrollTop;
          this.showAnchor = offsetY > 280;
          this.cdr.markForCheck();
        });
    }
  }

  private getFlattenTreeFromArticle = (article: ResolvedArticle): ResolvedArticle['toc'] => {
    if (!article.toc.length) {
      return [];
    } else {
      const firstDepth = article.toc[0].depth;
      return article.toc.map(e => ({
        ...e,
        depth: e.depth - firstDepth
      }));
    }
  };
}
