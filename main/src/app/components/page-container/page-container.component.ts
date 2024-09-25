import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'paimon-page-container',
  standalone: true,
  imports: [],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageContainerComponent {}
