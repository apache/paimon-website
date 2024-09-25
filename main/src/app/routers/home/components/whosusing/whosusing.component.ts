import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'paimon-whosusing',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './whosusing.component.html',
  styleUrl: './whosusing.component.css',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhosusingComponent {
  listOfUsers: {
    label: string;
    src: string;
    width?: number;
    height?: number;
  }[] = [
    'aliyun.png',
    'bytedance.png',
    'ximalaya.png',
    'antgroup.png',
    'zhongyuanbank.png',
    'autohome.png',
    'dustess.png',
    'babeltime.png',
    'tongchengtravel.png',
    'mihoyo.png',
    'highlandhuanyu.png',
    'ziroom.png',
    'starrocks.png',
    'kuayueexpress.png',
    'selectdb.png',
    'dinky.png',
    'ververica.png',
    'amoro.png',
    'netEase-media.png',
    'celerdata.png',
    'unicom.png',
    'unicom-digital.png',
    'zhihu.png',
    'xgimi.png',
    'bilibili.png'
  ].map(img => {
    const largeHeightImgs = ['highlandhuanyu.png', 'ziroom.png', 'dinky.png'];
    return {
      label: img,
      src: `/assets/users/${img}`,
      width: largeHeightImgs.includes(img) ? 64 : 191,
      height: largeHeightImgs.includes(img) ? 72 : 133
    };
  });
}
