import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements AfterViewInit {
  @ViewChild('parentDiv') divView: any;
  @ViewChild(MatSort)
  sort!: MatSort;

  list: any[] = [1,2,3,4,5,6,7,8];

  myTime: any;
  div: any = 0;
  minutes: any;
  time: any;
  radius: any = 0;
  totalOffset: any = 0;

  constructor(private gameService: GameService, private  router: Router) {
    this.div = 360 / this.list.length;
    this.radius = 100;
  }

  ngAfterViewInit() {
  }

  getChildTopValue(index: any) {
    const y = (Math.cos((this.div * index) * (Math.PI / 180)) * this.radius);
    return (y).toString() + 'px';
  }

  getChildLeftValue(index: any) {
    const x = (Math.sin((this.div * index) * (Math.PI / 180)) * this.radius);
    return (x).toString() + 'px';
  }








}
