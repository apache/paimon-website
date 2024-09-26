import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BriefArticle } from '@paimon-markdown-parser/article';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-blog-card',
  standalone: true,
  imports: [DatePipe, RouterLink, TranslateModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogCardComponent {
  @Input() article: BriefArticle;
}
