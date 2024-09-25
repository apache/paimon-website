import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'paimon-divider',
  standalone: true,
  imports: [NgClass],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  @Input() direction: 'horizontal' | 'vertical' = 'vertical';
  @Input() classNames = '';
}
