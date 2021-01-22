import { Component, OnInit, Input } from '@angular/core';
import {HeaderComponent} from '@app/gameplay/common/header/header.component';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit {
  @Input() tittle!: string;


  constructor() {
  }

  ngOnInit(): void {
  }

}
