import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  @Input() star!: number | string;
  public starArr: Array<number | string> = [];

  constructor() {}
  ngOnInit(): void {
    this.starArr = new Array(this.star);
  }
}
