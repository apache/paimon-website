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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'paimon-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pageIndex = 1;
  @Input() pageSize = 15;
  @Input() total = 15;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  maxPage = 1;
  list: Array<string | number> = [];

  ngOnInit(): void {
    this.maxPage = Math.ceil(this.total / this.pageSize);
    this.pageChange();
  }

  ngOnChanges(): void {
    this.maxPage = Math.ceil(this.total / this.pageSize);
    this.pageChange();
  }

  previous(): void {
    if (!this.previousDisabled()) {
      this.setPageIndex(this.pageIndex - 1);
    }
  }

  next(): void {
    if (!this.nextDisabled()) {
      this.setPageIndex(this.pageIndex + 1);
    }
  }

  isFirstIndex(): boolean {
    return this.pageIndex <= 1;
  }

  isLastIndex(): boolean {
    return this.pageIndex * this.pageSize >= this.total;
  }

  previousDisabled(): boolean {
    return this.pageIndex <= 1;
  }

  nextDisabled(): boolean {
    return this.pageIndex * this.pageSize >= this.total;
  }

  setPageIndex(value: number | string): void {
    if (typeof value === 'number') {
      this.pageIndex = value;
      this.pageIndexChange.emit(value);
      this.pageChange();
    }
  }

  pageChange(): void {
    if (this.maxPage < 8) {
      this.list = [];
      for (let i = 1; i <= this.maxPage; i++) {
        this.list.push(i);
      }
      return;
    }
    if (this.pageIndex > 4) {
      if (this.pageIndex < this.maxPage - 3) {
        this.pageIndex = Number(this.pageIndex);
        this.list = [
          1,
          '···',
          this.pageIndex - 2,
          this.pageIndex - 1,
          this.pageIndex,
          this.pageIndex + 1,
          this.pageIndex + 2,
          '···',
          this.maxPage
        ];
      } else {
        this.list = [1, '···', this.maxPage - 4, this.maxPage - 3, this.maxPage - 2, this.maxPage - 1, this.maxPage];
      }
    } else {
      this.list = [1, 2, 3, 4, 5, '···', this.maxPage];
    }
  }
}
