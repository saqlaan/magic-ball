import { Component, OnInit } from '@angular/core';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '@app/shared/services/game/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gamedashboard',
  templateUrl: './gamedashboard.component.html',
  styleUrls: ['./gamedashboard.component.css']
})
export class GamedashboardComponent implements OnInit {

  public gameCode: any ;
  public players: Array<any> = [];
  public gameStarted = false;
  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
    this.gameStarted = false;
  }

  ngOnInit(): void {

    let status: string;
    let host: string;
    status = 'active';
    host = 'host';
    this.gameService.addgame(status).subscribe((game) => {
      // this.ws.init(host, game.gameCode, null, null);
      this.gameCode = game.gameCode;
      this.router.navigate(['/gamedashboard']);
    });
      // this.gameService.getGamePlayers().subscribe(players => {
      //   this.players = players;
      // });
  }

  startGame(): void {
    this.ws.startGame(this.gameCode);
    this.gameStarted = true;
  }


}
