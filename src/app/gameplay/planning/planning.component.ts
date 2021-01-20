import {Component, OnInit,AfterViewInit, ViewChild} from '@angular/core';
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

  displayedColumns: string[] = ['currentRound', 'ballsEstimate', 'ballsMade'];
  dataSource: any;
  list: any[] = [
    {inc_id: 1, id: 1213}, {inc_id: 2, id: 1223}, {inc_id: 3, id: 1233},
    {inc_id: 4, id: 1423}, {inc_id: 5, id: 1253}, {inc_id: 6, id: 1263},
    {inc_id: 7, id: 1273}, {inc_id: 8, id: 1293}
  ];

  myTime: any;
  ballsEstimate: any;
  ballsMade: any;
  players: any;
  div: any = 0;
  currentTime: any;
  minutes: any;
  messageSuccess!: boolean;
  time: any;
  gameCode!: string;
  gameId!: string;
  radius: any = 0;
  totalOffset: any = 0;
  icons: any = false;
  arch: any = 4;
  countingResponsible: any = 3;
  timekeeper: any = 5;
  swapped: any[] = [];
  currentRound: number = 0;

  initialtittle: string = 'testing';

  constructor(private gameService: GameService, private  router: Router) {
    this.div = 360 / this.list.length;
    this.radius = 100;
  }

  ngAfterViewInit() {
    const offsetToParentCenter = this.divView.nativeElement.offsetWidth / 2;
    const offsetToChildCenter = 20;
    this.totalOffset = offsetToParentCenter - offsetToChildCenter;
  }

  getChildTopValue(index: any) {
    const y = (Math.cos((this.div * index) * (Math.PI / 180)) * this.radius);
    return (y + this.totalOffset).toString() + 'px';
  }

  getChildLeftValue(index: any) {
    const x = (Math.sin((this.div * index) * (Math.PI / 180)) * this.radius);
    return (x + this.totalOffset).toString() + 'px';
  }

  onSelectPlayer(item: any) {
    if (this.swapped.length !== 2) {
      const index = this.swapped.findIndex((i) => i === item);
      if (index === -1) {
        this.swapped.push(item);
      } else {
        this.swapped = this.swapped.filter(i => i !== item);
      }
    }
  }

  isPlayerSelected(item: any) {
    return (this.swapped.findIndex(player => player === item) > -1);
  }

  swapPositions() {
    if (this.swapped.length === 2) {
      const indexA = this.list.findIndex(item => item === this.swapped[0]);
      const indexB = this.list.findIndex(item => item === this.swapped[1]);
      let temp = this.list[indexA];
      this.list[indexA] = this.list[indexB];
      this.list[indexB] = temp;
      this.swapped = [];
    }
    return null;
  }


}
