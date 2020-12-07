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

  public game_id!: string ;
  public players: Array<any> = [];

  constructor(private gameService: GameService) {  }

  ngOnInit(): void {
      const _id = localStorage.getItem('game_id');
      this.game_id = ((_id != null) ? _id : '');
      this.gameService.getGamePlayers().subscribe(players => {
        this.players = players;
      });
  }

}
