import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageContainerComponent } from '@paimon/app/components/page-container/page-container.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'paimon-blog',
  standalone: true,
  imports: [PageContainerComponent, RouterOutlet],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent {}
