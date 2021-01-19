import {Component, OnInit} from '@angular/core';
import {GameService} from '@app/shared/services';
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
  copyList: any;
  gameCode!: string;
  selectedBalls: number = 0;
  batchCompleted!: boolean;
  totalRounds: any;
  whiteBallStatus: any;
  currentRound: any;
  balls: any;
  gameId: any;
  show: boolean;
  readyForm = new FormGroup({
    batchNumber: new FormControl('', [Validators.required]),
  });


  constructor(private gameService: GameService, private  router: Router) {
    this.show = true;
  }


  ngOnInit(): void {
    this.copyList = [...this.ballsArrangement];
    this.batchCompleted = true;
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.currentRound = Game.currentRound;
      if (this.currentRound == 1) {
        this.show = false;
      }
      this.totalRounds = Game.noOfRounds;
      this.gameId = Game._id;
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
    if (this.currentRound == 1) {
      this.gameService.addReady(this.gameId, [null], '').subscribe((Game) => {
        this.router.navigate(['/gameplay']);
      });
    } else {
      this.gameService.addReady(this.gameId, this.ballsArrangement, this.readyForm.value.batchNumber).subscribe((Game) => {
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

}
