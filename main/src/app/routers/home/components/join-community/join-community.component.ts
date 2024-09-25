import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-join-community',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './join-community.component.html',
  styleUrl: './join-community.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinCommunityComponent {}
