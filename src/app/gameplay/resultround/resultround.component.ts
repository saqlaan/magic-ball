import {Component, Input, OnInit} from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-resultround',
  templateUrl: './resultround.component.html',
  styleUrls: ['./resultround.component.css']
})
export class ResultroundComponent implements OnInit {

  @Input () game!: any;

  roundComplete: boolean = false;
  roundScore:any;
  constructor(private gameService: GameService, private  router: Router) {
  }

  ngOnInit(): void {
    this.gameService.getGame(this.game.gameCode).subscribe((game) => {
      this.game = game;
    });
      this.roundScore = this.game.rounds[this.game.currentRound - 1].ballsMade;
  }

}
