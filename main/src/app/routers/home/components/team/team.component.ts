import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-team',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {
  listOfPMCs: { avatarId: string; name: string }[] = [
    {
      avatarId: '9601882',
      name: 'Jingsong Lee (Chair)'
    },
    {
      avatarId: '5778611',
      name: 'Becket Qin'
    },
    {
      avatarId: '89049',
      name: 'Robert Metzger'
    },
    {
      avatarId: '1727146',
      name: 'Stephan Ewen'
    },
    {
      avatarId: '6239804',
      name: 'Yu Li'
    },
    {
      avatarId: '19909549',
      name: 'Caizhi Weng'
    },
    {
      avatarId: '99001603',
      name: 'Feng Wang'
    },
    {
      avatarId: '10048174',
      name: 'Nicholas Jiang'
    },
    {
      avatarId: '5746567',
      name: 'Timo Walther'
    },
    {
      avatarId: '28703471',
      name: 'Fang Yong'
    },
    {
      avatarId: '33053040',
      name: 'Zelin Yu'
    },
    {
      avatarId: '10036681',
      name: 'Bi Yan'
    }
  ];

  listOfCommitters: { avatarId: string; name: string }[] = [
    {
      avatarId: '37063904',
      name: 'Chong Zhuang'
    },
    {
      avatarId: '69444450',
      name: 'Ming Li'
    },
    {
      avatarId: '41894543',
      name: 'Junhao Ye'
    },
    {
      avatarId: '26704332',
      name: 'Guojun Li'
    },
    {
      avatarId: '9486140',
      name: 'WenJun Min'
    },
    {
      avatarId: '37108074',
      name: 'Xinyu Zou'
    }
  ];

  listOfTeam = [...this.listOfPMCs, ...this.listOfCommitters];
}
