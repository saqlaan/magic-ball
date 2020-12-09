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

  public game_code!: string ;
  public players: Array<any> = [];

  constructor(private gameService: GameService, private ws: WebSocketService) {  }

  ngOnInit(): void {
      const game_code = localStorage.getItem('game_code');
      this.game_code = ((game_code != null) ? game_code : '');
      this.gameService.getGamePlayers().subscribe(players => {
        this.players = players;
      });
  }
  startgame(): void {
    this.ws.startGame(this.game_code);
  }

}
