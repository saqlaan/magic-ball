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
  estimate: any = {};
  gameData: any = {};
  gameCode: any;
  players: any;
  show!: boolean;
  estimateForm = new FormGroup({
    estimatedBalls: new FormControl('', [Validators.required]),
    archWizard: new FormControl('', [Validators.required]),
  });

  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
  }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.gameData = Game;
      if (this.gameData.currentRound == 1) {
        this.estimateForm.patchValue({
          scoreKeeper: 1,
          timeKeeper: 1
        });
        this.show = true;
      } else {
        this.estimateForm.patchValue({
          archWizard: 1
        });
        this.show = false;
      }
      this.players = this.gameData.players.map((x: any) => (x.id));

    });
  }

  addEstimate() {

    if (this.gameData.currentRound == 1) {
      this.estimate.archWizard = this.players[this.estimateForm.value.archWizard - 1];
    } else {
      this.estimate.scoreKeeper = this.players[this.estimateForm.value.scoreKeeper - 1];
      this.estimate.timeKeeper = this.players[this.estimateForm.value.timeKeeper - 1];
    }
    this.estimate['timeKeeper'] = this.gameData.players[0].id;
    this.estimate['scoreKeeper'] = this.gameData.players[1].id;
    this.estimate.ballsEstimate = this.estimateForm.value.estimatedBalls;
    this.estimate.gameId = this.gameData._id;
    this.gameService.addEstimate(this.estimate).subscribe((Game) => {
      this.router.navigate(['/addready']);
    });
  }


}
