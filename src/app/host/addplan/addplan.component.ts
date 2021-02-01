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
  timekeeper: any = 5;
  timer: any;
  swapped: any[] = [];
  interval: any;


  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
  }
  ngAfterViewInit() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      this.game = game;
      if (this.game.currentRound == 1) {
        this.show = true;
      }
      this.timer = this.game.rounds[game.currentRound - 1].stepEndingTime - Date.now();
      // const seconds = Math.floor((this.timer % (1000 * 60)) / 1000);
      if (this.timer > 0 && this.timer !== 0) {
        this.interval = setTimeout(() => {
        this.addPlan();
        }, this.timer);
      }
      this.list = [...game.players];
      this.time = game.rounds[game.currentRound - 1].stepEndingTime;
      this.currentTime = this.time - Date.now();
      this.div = 360 / this.list.length;
      this.radius = 100;
    });

  }
  addPlan() {
    clearInterval(this.interval);
    const gameData = {
      round: {
        roundId: this.game.rounds[this.game.currentRound - 1]._id,
        roundData: {
          stepEndingTime: 0,
          status: 'estimate'
        }
      }
    };
    if (this.game.currentRound > 1) {
      gameData['players'] = this.game.players;
    }
    this.gameService.updateRoundConfiguration(this.game._id, {
      ...gameData
    }).subscribe(game => {
      this.router.navigate(['/addestimate']);
    });
  }

  dragHandler(event: any, index: any) {
    const {x, y} = event.distance;
    this.game.players[index] = {
      ...this.game.players[index],
      position: {
        x: this.game.players[index].position.x + x,
        y: this.game.players[index].position.y + y,
      }
    };
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
