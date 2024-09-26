import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'paimon-blog-detail-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-detail-footer.component.html',
  styleUrl: './blog-detail-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailFooterComponent {
  @Input() preName: undefined | string;
  @Input() preUrl: (undefined | string)[] = [];
  @Input() nextName: undefined | string;
  @Input() nextUrl: (undefined | string)[] = [];
}
