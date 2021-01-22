import {Component, Input, OnInit} from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gameresult',
  templateUrl: './gameresult.component.html',
  styleUrls: ['./gameresult.component.css']
})
export class GameresultComponent implements OnInit {
  @Input () gameCode!: string;
  gameId: any;
  totalScore:any;
  constructor(private gameService: GameService, private  router: Router) { }

  ngOnInit(): void {
    this.gameService.getGame(this.gameCode).subscribe((game) => {
      this.totalScore = game.totalScore;
    });
  }

}
