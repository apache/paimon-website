import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

interface DropdownOption {
  label: string;
  value: string;
  target?: string;
}

@Component({
  selector: 'paimon-dropdown-links',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dropdown-links.component.html',
  styleUrl: './dropdown-links.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    ngSkipHydration: 'true'
  }
})
export class DropdownLinksComponent {
  @Input() options: DropdownOption[] = [];
}
