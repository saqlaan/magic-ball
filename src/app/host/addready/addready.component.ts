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

  redBall(i: any, j: any) {
    this.selectedBalls = this.selectedBalls + 1;
    if (this.readyForm.value.batchNumber == this.selectedBalls) {
      this.batchCompleted = true;
    }
    for (let index1 = 0; index1 < this.ballsArrangement.length; index1++) {
      for (let index2 = 0; index2 < this.ballsArrangement.length; index2++) {
        if (index1 == i && index2 == j) {
          let temp = [...this.ballsArrangement[index1]];
          temp[index2] = 0;
          this.ballsArrangement[index1] = temp;
        }
      }
    }
  }

  whiteBall(b: any, s: any) {
    this.selectedBalls = this.selectedBalls - 1;
    if (this.readyForm.value.batchNumber !== this.selectedBalls) {
      this.batchCompleted = false;
    }
    for (let index1 = 0; index1 < this.ballsArrangement.length; index1++) {
      for (let index2 = 0; index2 < this.ballsArrangement.length; index2++) {
        if (index1 == b && index2 == s) {
          if (index1 == 0 || index2 == 0 || index1 == this.ballsArrangement.length - 1 || index2 == this.ballsArrangement.length - 1) {
            let temp = [...this.ballsArrangement[index1]];
            temp[index2] = -1;
            this.ballsArrangement[index1] = temp;
          } else {
            let temp = [...this.ballsArrangement[index1]];
            temp[index2] = 1;
            this.ballsArrangement[index1] = temp;
          }
        }
      }
    }
  }


  greenBall(i: any, j: any) {
    this.selectedBalls = this.selectedBalls + 1;
    if (this.readyForm.value.batchNumber == this.selectedBalls) {
      this.batchCompleted = true;
    }
    for (let index1 = 0; index1 < this.ballsArrangement.length; index1++) {
      for (let index2 = 0; index2 < this.ballsArrangement.length; index2++) {
        if (index1 == i && index2 == j) {
          let temp = [...this.ballsArrangement[index1]];
          temp[index2] = 0;
          this.ballsArrangement[index1] = temp;
        }
      }
    }
  }


}
