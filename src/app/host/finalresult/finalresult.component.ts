import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-finalresult',
  templateUrl: './finalresult.component.html',
  styleUrls: ['./finalresult.component.css']
})
export class FinalresultComponent implements OnInit {
  gameCode: any;
  totalRounds: any;
  currentRound: any;
  result: any;
  gameId: any;
  archWizard: any;
  show!: boolean;
  batchNumber: any;
  estimatedBalls: any;
  constructor(private gameService: GameService, private  router: Router) { }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.gameId = Game._id;
      if (this.currentRound == 1) {
        this.show = true;
      }else {
        this.show = false;
      }
      this.result = Game.players.map((x: any) => (x.id));

    });
  }

}
