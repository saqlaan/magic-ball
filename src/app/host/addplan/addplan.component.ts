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
  @ViewChild('boundry') dragBoundary: any;
  @ViewChild('parentDiv') divView: any;
  currentTime: any;
  time: any;
  game: any;
  list: any[] = [];
  myTime: any;
  div: any = 0;
  minutes: any;
  radius: any = 0;
  icons: any = false;
  totalOffset: any = 0;
  show: boolean = false;
  arch: any = 4;
  countingResponsible: any = 3;
  timekeeper: any = 5;
  swapped: any[] = [];


  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
  }

  ngAfterViewInit() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      this.game = game;
      if (this.game.currentRound == 1) {
        this.show = true;
      }
      this.list = [...game.players];
      this.time = game.rounds[game.currentRound - 1].stepEndingTime;
      this.currentTime = this.time - Date.now();
      this.div = 360 / this.list.length;
      this.radius = 100;
      const offsetToParentCenter = this.divView.nativeElement.offsetWidth / 2;
      const offsetToChildCenter = 20;
      this.totalOffset = offsetToParentCenter - offsetToChildCenter;
    });

  }

  addplan() {
    this.gameService.addPlan(this.game._id, this.list).subscribe((Game) => {
      this.router.navigate(['/addestimate']);
    });
  }

  dragHandler(event: any, index: any) {
    const {x, y} = event.distance;
    this.list[index] = {
      ...this.list[index],
      position: {
        x: this.list[index].position.x + x,
        y: this.list[index].position.y + y,
      }
    };
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
      if (index === -1)  {
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
    if(this.swapped.length === 2) {
      const indexA = this.list.findIndex(item => item === this.swapped[0]);
      const indexB = this.list.findIndex(item => item === this.swapped[1]);
      let temp = this.list[indexA];
      this.list[indexA] = this.list[indexB];
      this.list[indexB] = temp;
      console.log(this.list);
      this.swapped = [];
    }
    return null;
  }

}
