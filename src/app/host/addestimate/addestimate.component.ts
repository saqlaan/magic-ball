import {Component, OnInit} from '@angular/core';
import {GameService, WebSocketService} from '@app/shared/services';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-addestimate',
  templateUrl: './addestimate.component.html',
  styleUrls: ['./addestimate.component.css']
})
export class AddestimateComponent implements OnInit {
  game: any = {};
  gameCode: any;
  totalRounds: any;
  currentRound: any;
  result: any;
  gameId: any;
  archWizard: any;
  show!: boolean;
  show1 = true;
  batchNumber: any;
  estimatedBalls: any;
  estimateForm = new FormGroup({
    estimatedBalls: new FormControl('', [Validators.required]),
    archWizard: new FormControl('', [Validators.required]),
    scoreKeeper: new FormControl('', [Validators.required]),
    timeKeeper: new FormControl('', [Validators.required]),
  });

  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
  }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.currentRound = Game.currentRound;
      this.totalRounds = Game.noOfRounds;
      this.gameId = Game._id;
      if (this.currentRound == 1) {
        this.show = true;
      }else {
        this.show = false;
      }
      this.result = Game.players.map((x: any) => (x.id));

    });
  }

  addEstimate() {
    this.game.archWizard = this.result[this.estimateForm.value.archWizard - 1];
    this.game.balls = this.estimateForm.value.estimatedBalls;
    this.game.scoreKeeper = this.result[this.estimateForm.value.scoreKeeper - 1];
    this.game.timeKeeper = this.result[this.estimateForm.value.timeKeeper -1];
    this.game.gameId = this.gameId;
    this.gameService.addEstimate(this.game).subscribe((Game) => {
      this.router.navigate(['/addready']);
    });
  }


}
