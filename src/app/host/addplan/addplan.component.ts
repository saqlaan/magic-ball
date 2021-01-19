import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GameService, WebSocketService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component(
  {
    selector: 'app-addplan',
    templateUrl: './addplan.component.html',
    styleUrls: ['./addplan.component.css']
  }
)
export class AddplanComponent implements AfterViewInit {
  @ViewChild('parentDiv') divView: any;

  list: any[] = [1,2,3,4,5,6];

  myTime: any;
  updateList: any[] = [];
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


  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {

  }

  ngAfterViewInit() {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.time = Game.rounds[Game.currentRound - 1].stepEndingTime;
      let date = new Date();
      this.currentTime = date.getTime();
      this.currentTime = this.time - this.currentTime;
      this.updateList = Game.players.map((inc_id: any) => ({inc_id: inc_id.incrementalId}));
      this.list = Game.players.map((inc_id: any) => ({inc_id: inc_id.incrementalId}));
      this.gameId = Game._id;
      this.div = 360 / this.list.length;
      this.radius = 100;
      const offsetToParentCenter = this.divView.nativeElement.offsetWidth / 2;
      const offsetToChildCenter = 20;
      this.totalOffset = offsetToParentCenter - offsetToChildCenter;
      this.messageSuccess = true;
    });
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
    console.log(this.swapped);
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

  addplan() {
    if (JSON.stringify(this.list) !== JSON.stringify(this.updateList)) {
      this.gameService.addPlan(this.gameId, this.list).subscribe((Game) => {
        this.router.navigate(['/addestimate']);
      });
    } else {
      this.gameService.addPlan(this.gameId, []).subscribe((Game) => {
        this.router.navigate(['/addestimate']);
      });
    }
  }
}
