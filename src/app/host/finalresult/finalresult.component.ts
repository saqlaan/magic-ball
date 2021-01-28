import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-finalresult',
  templateUrl: './finalresult.component.html',
  styleUrls: ['./finalresult.component.css']
})
export class FinalresultComponent implements OnInit {
  game: any;
  constructor(private gameService: GameService, private  router: Router) { }

  ngOnInit(): void {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      this.game = game;
    });
  }
  dashboard() {
    this.router.navigate(['/hostdashboard']);
  }
}
