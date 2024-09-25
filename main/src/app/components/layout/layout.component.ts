import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '@paimon/app/components/header/header.component';

@Component({
  selector: 'paimon-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {}
