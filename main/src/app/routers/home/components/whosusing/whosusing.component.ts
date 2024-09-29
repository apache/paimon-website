/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  listOfUsers: Array<{
    label: string;
    src: string;
    width?: number;
    height?: number;
  }> = [
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
      src: `assets/users/${img}`,
      width: largeHeightImgs.includes(img) ? 64 : 191,
      height: largeHeightImgs.includes(img) ? 72 : 133
    };
  });
}
