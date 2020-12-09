import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services/game/game.service';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';

@Component({
  selector: 'app-playerdashboard',
  templateUrl: './playerdashboard.component.html',
  styleUrls: ['./playerdashboard.component.css']
})
export class PlayerdashboardComponent implements OnInit {
  hasBall: Boolean = false;
  gameCode: any;

  public players: Array<any> = [];

  constructor(private gameService: GameService, private ws: WebSocketService) {
    this.hasBall = false;
    this.gameCode = '';
  }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('game_code');
    this.gameService.getGamePlayers().subscribe(players => {
      this.players = players;
    });
    this.gameService.getBallStatus().subscribe(status => {
      this.hasBall = status;
    });
  }

  moveBall(): void {
    this.ws.moveBall(this.gameCode);
    this.gameService.ballMoved();
  }

}
