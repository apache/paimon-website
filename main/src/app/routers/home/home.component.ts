import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OverviewComponent } from '@paimon/app/routers/home/components/overview/overview.component';
import { AboutComponent } from '@paimon/app/routers/home/components/about/about.component';
import { KeyFeaturesComponent } from '@paimon/app/routers/home/components/key-features/key-features.component';
import { WhosusingComponent } from '@paimon/app/routers/home/components/whosusing/whosusing.component';
import { TeamComponent } from '@paimon/app/routers/home/components/team/team.component';
import { JoinCommunityComponent } from '@paimon/app/routers/home/components/join-community/join-community.component';
import { FooterComponent } from '@paimon/app/routers/home/components/footer/footer.component';

@Component({
  selector: 'paimon-home',
  standalone: true,
  imports: [
    OverviewComponent,
    AboutComponent,
    KeyFeaturesComponent,
    WhosusingComponent,
    TeamComponent,
    JoinCommunityComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
