import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-roundresult',
  templateUrl: './roundresult.component.html',
  styleUrls: ['./roundresult.component.css']
})
export class RoundresultComponent implements OnInit {

  gameCode: any;
  roundScore:any;
  gameId: any;
  constructor(private gameService: GameService, private  router: Router) {
  }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((game) => {
      this.gameId = game._id;
      this.roundScore = game.rounds[game.currentRound - 1].ballsMade;
    });
  }
  startRound() {
    this.gameService.startRound(this.gameId).subscribe((game) => {
      this.router.navigate(['addplan']);
    });
  }

}
