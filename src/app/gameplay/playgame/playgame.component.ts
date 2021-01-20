import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playgame',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.css']
})
export class PlaygameComponent implements OnInit {
  @ViewChild('parentDiv') divView: any;
  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['currentRound', 'ballsEstimate', 'ballsMade'];
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
  currentRound: number = 0;
  constructor(private gameService: GameService, private  router: Router) {
  }

  ngOnInit(): void {
  this.gameCode = localStorage.getItem('gameCode') as string;
  this.gameService.getGame(this.gameCode).subscribe((game) => {
  this.players = game.players.map((id: any) => (id.id));
  this.list = game.players.map((inc_id: any) => ({inc_id: inc_id.incrementalId}));
  this.gameId = game._id;
  this.arch = 1 + this.players.indexOf((game.rounds[game.currentRound - 1].currentBallHolder));
  this.timekeeper = this.players.indexOf(game.timeKeeper)
  this.currentRound = game.currentRound;
  this.dataSource = new MatTableDataSource(game.rounds);
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
