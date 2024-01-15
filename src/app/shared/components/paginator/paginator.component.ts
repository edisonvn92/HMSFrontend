import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @ViewChild(NgbDropdown, { static: false, read: NgbDropdown }) ngbDropdown!: NgbDropdown;
  @Input() pageSize!: number;
  @Input() page: number = 0;
  @Input() collectionSize!: number;
  @Input() hasCollectionSize = true;
  @Input() className!: string;
  @Output() pageChange = new EventEmitter<any>();
  @Input() perPage: number = 20;
  public listPerPage = [20, 50, 100];
  public isOpenSelect = false;
  constructor() {}

  /**
   * Handle change Per Page event
   */
  public changePerPage(perPage: number): void {
    this.perPage = perPage;
    this.ngbDropdown.close();
    this.pageChange.emit({ page: 1, perPage: this.perPage });
  }

  /**
   *Handle event when select tag is clicked
   */
  public changeSelectStatus(): void {
    this.isOpenSelect = !this.isOpenSelect;
  }
}
