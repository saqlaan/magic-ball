import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services/game.service';


@Component({
  selector: 'app-playerdashboard',
  templateUrl: './playerdashboard.component.html',
  styleUrls: ['./playerdashboard.component.css']
})
export class PlayerdashboardComponent implements OnInit {

  public players: Array<any> = [];
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getGamePlayers().subscribe(players => {
      this.players = players;
    });
  }

}
