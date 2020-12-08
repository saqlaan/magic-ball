import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services/game.service';
import {WebSocketService} from '@app/shared/services';


@Component({
  selector: 'app-playerdashboard',
  templateUrl: './playerdashboard.component.html',
  styleUrls: ['./playerdashboard.component.css']
})
export class PlayerdashboardComponent implements OnInit {


  public hasball!: boolean;
  public game_code!: string;
  public players: Array<any> = [

  ];
  constructor(private gameService: GameService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
    this.gameService.getGamePlayers().subscribe(players => {
      this.players = players;
    });
    this.hasball = true;
    const game_code = localStorage.getItem('game_code');
    this.game_code = ((game_code != null) ? game_code : '');
      this.gameService.getballStatus().subscribe(hasBall => {
          this.hasball = hasBall;
      });
  }
  moveball(): void {
    let game_code: string;
    game_code = this.game_code;
    this.ws.moveBall(game_code);
    this.hasball = false;
  }
}
