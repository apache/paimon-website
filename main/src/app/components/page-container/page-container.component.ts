import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '@paimon/app/components/footer/footer.component';

@Component({
  selector: 'paimon-page-container',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContainerComponent {}
