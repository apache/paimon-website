import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-key-features',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './key-features.component.html',
  styleUrl: './key-features.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyFeaturesComponent {}
