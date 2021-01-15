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
  gameId: any;
  totalScore:any;
  constructor(private gameService: GameService, private  router: Router) { }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((game) => {
      this.totalScore = game.totalScore;
      this.gameId = game._id;

    });
  }

}
