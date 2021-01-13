import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})
export class GameplayComponent implements AfterViewInit {
  @ViewChild('parentDiv') divView: any;
  @ViewChild(MatSort)
  sort!: MatSort;
  elementData: any = [];

  displayedColumns: string[] = ['currentRound',  'ballsEstimate', "ballsMade" ];
  dataSource: any;
  list: any[] = [];

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
  currentRound: any;


  constructor(private gameService: GameService, private  router: Router) {
  }

  ngAfterViewInit() {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.players = Game.players.map((id: any) => (id.id));
      this.list = Game.players.map((inc_id: any) => ({inc_id: inc_id.incrementalId}));
      this.arch = 1 + this.players.indexOf((Game.rounds[Game.currentRound - 1].currentBallHolder));
      this. currentRound = Game.rounds.length;
      this.elementData = Game.rounds;
      this.dataSource = new MatTableDataSource(this.elementData);
      this.div = 360 / this.list.length;
      this.radius = 100;
      const offsetToParentCenter = this.divView.nativeElement.offsetWidth / 2;
      const offsetToChildCenter = 20;
      this.totalOffset = offsetToParentCenter - offsetToChildCenter;
    });
    this.dataSource.sort = this.sort;
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
