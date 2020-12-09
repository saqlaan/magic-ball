import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {AuthService, WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '@app/shared/services/game.service';

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
      this.gameCode = localStorage.getItem('game_id');
      this.gameService.getGamePlayers().subscribe(players => {
        this.players = players;
      });
  }
  startGame(): void {
    this.ws.startGame(this.gameCode);
    this.gameStarted = true;
  }


}
