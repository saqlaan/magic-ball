import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '@app/shared/services/game/game.service';

@Component({
  selector: 'app-gamedashboard',
  templateUrl: './gamedashboard.component.html',
  styleUrls: ['./gamedashboard.component.css']
})
export class GamedashboardComponent implements OnInit {

  public gameCode: any ;
  public players: Array<any> = [];
  public gameStarted = false;
  constructor(private gameService: GameService, private ws: WebSocketService) {
    this.gameStarted = false;
  }

  ngOnInit(): void {
      this.gameCode = localStorage.getItem('game_code');
      this.gameService.getGamePlayers().subscribe(players => {
        this.players = players;
      });
  }

  startGame(): void {
    this.ws.startGame(this.gameCode);
    this.gameStarted = true;
  }


}
