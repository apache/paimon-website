import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DropdownLinksComponent } from '@paimon/app/components/ui-components/components/dropdown-links/dropdown-links.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-overview',
  standalone: true,
  imports: [DropdownLinksComponent, TranslateModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {}
