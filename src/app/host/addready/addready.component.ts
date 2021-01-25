import {Component, OnInit} from '@angular/core';
import {GameService, WebSocketService} from '@app/shared/services';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';

@Component({
  selector: 'app-addready',
  templateUrl: './addready.component.html',
  styleUrls: ['./addready.component.css']
})
export class AddreadyComponent implements OnInit {
  list: any;
  ballsArrangement: any[][] = [
    [-1, -1, -1, -1, -1],
    [-1, 1, 1, 1, -1],
    [-1, 1, 1, 1, -1],
    [-1, 1, 1, 1, -1],
    [-1, -1, -1, -1, -1]
  ];
  game :any  = {};
  copyList: any;
  gameCode!: string;
  selectedBalls: number = 0;
  batchCompleted!: boolean;
  whiteBallStatus: any;
  balls: any;
  show: boolean;
  readyForm = new FormGroup({
    batchNumber: new FormControl('', [Validators.required]),
  });


  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
    this.show = true;
  }


  ngOnInit(): void {
    this.copyList = [...this.ballsArrangement];
    this.batchCompleted = true;
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.game = Game;
      if (this.game.currentRound == 1) {
        this.show = false;
      }
    });
  }

  onValueChanges(val: any): void {
    this.selectedBalls = 0;
    this.balls = this.readyForm.value.batchNumber;
    this.ballsArrangement = [...this.copyList];
    this.batchCompleted = false;
    this.readyForm.value.batchNumber = val;
  }

  addReady() {
    if (this.game.currentRound == 1) {
      this.gameService.addReady(this.game._id, 1, 0).subscribe((Game) => {
        this.router.navigate(['/gameplay']);
      });
    } else {
      this.gameService.addReady(this.game._id, this.readyForm.value.batchNumber, this.getWastedBalls()).subscribe((Game) => {
        this.router.navigate(['/gameplay']);
      });
    }
  }

  onBallChange(i: any, j: any) {
    this.selectedBalls++;
    if (this.readyForm.value.batchNumber == this.selectedBalls) {
      this.batchCompleted = true;
    }
    let temp = [...this.ballsArrangement[i]];
    temp[j] = 0;
    this.ballsArrangement[i] = temp;
  }

  getBallStatus(i: any, j: any) {
    this.selectedBalls --;
    if (this.readyForm.value.batchNumber !== this.selectedBalls) {
      this.batchCompleted = false;
    }
    if (i == 0 || j == 0 || i == this.ballsArrangement.length - 1 || j == this.ballsArrangement.length - 1) {
      let temp = [...this.ballsArrangement[i]];
      temp[j] = -1;
      this.ballsArrangement[i] = temp;
    } else {
      let temp = [...this.ballsArrangement[i]];
      temp[j] = 1;
      this.ballsArrangement[i] = temp;
    }
  }

  getWastedBalls() {
    let wastedBalls = 0;
    for (let i = 0; i < this.ballsArrangement.length; i++) {
      for (let j = 0; j < this.ballsArrangement[i].length; j++ ) {
        if (this.ballsArrangement[i][j] == 0) {
          if (i === 0 || i === this.ballsArrangement.length - 1 || j === 0 || j === this.ballsArrangement.length - 1) {
            wastedBalls++;
          }
        }
      }
    }
    return wastedBalls;
  }

}
