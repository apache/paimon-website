import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleService } from '@paimon/app/services/article.service';
import { ResolvedArticle } from '@paimon-markdown-parser/article';
import { filter, map, startWith } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-blog',
  standalone: true,
  imports: [PageContainerComponent, RouterOutlet, TranslateModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit {
  article: ResolvedArticle | null = null;
  destroyRef = inject(DestroyRef);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(item => {
          return item instanceof NavigationEnd;
        }),
        startWith(true),
        map(() => true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const id = this.activatedRoute?.snapshot?.firstChild?.params?.['id'];
        if (id) {
          this.articleService.get(id).subscribe(article => {
            this.article = article;
          });
        } else {
          this.article = null;
        }
      });
  }
}
