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
  currentTime: any;
  time: any;
  game: any;
  list: any[] = [];


  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
  }
  ngAfterViewInit() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      this.game = game;
      this.list = [...game.players];
      this.time = game.rounds[game.currentRound - 1].stepEndingTime;
      this.currentTime = this.time - Date.now();
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
}
