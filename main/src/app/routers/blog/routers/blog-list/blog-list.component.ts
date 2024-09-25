import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { ArticleService } from '@paimon/app/services/article.service';

@Component({
  selector: 'paimon-blog-list',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit {
  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.list().subscribe(data => {
      console.log(data);
    });
  }
}
