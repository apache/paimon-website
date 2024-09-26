import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { ArticleService } from '@paimon/app/services/article.service';
import { PaginationComponent } from '@paimon/app/components/ui-components/components/pagination/pagination.component';
import { BriefArticle } from '@paimon-markdown-parser/article';
import { BlogCardComponent } from '@paimon/app/routers/blog/components/blog-card/blog-card.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-blog-list',
  standalone: true,
  imports: [PageContainerComponent, PaginationComponent, BlogCardComponent, RouterLink, TranslateModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit {
  total = 0;
  pageIndex = 1;
  pageSize = 5;
  latestPostsPageSize = 10;
  selectedCategory = '';

  listOfArticles: BriefArticle[] = [];
  listOfShownArticles: BriefArticle[] = [];
  listOfLatestArticles: BriefArticle[] = [];
  listOfCategories: string[] = [];

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.articleService.list().subscribe(data => {
      this.total = data.length;
      this.listOfLatestArticles = data.slice(0, this.latestPostsPageSize);
      this.listOfShownArticles = data.slice(0, this.pageSize);
      this.listOfArticles = data;
      this.listOfCategories = this.articleService.getCategories(data);
      this.cdr.markForCheck();
    });
  }

  updateShown(): void {
    const filteredArticles = this.listOfArticles.filter(
      a => !this.selectedCategory || a.categories.includes(this.selectedCategory)
    );
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    this.listOfLatestArticles = filteredArticles.slice(0, this.latestPostsPageSize);
    this.listOfShownArticles = filteredArticles.slice(startIndex, startIndex + this.pageSize);
    this.total = filteredArticles.length;
  }

  categoryChange(value: string): void {
    this.pageIndex = 1;
    this.selectedCategory = value;
    this.updateShown();
  }
}
