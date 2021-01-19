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
  public ballsArrangement: any[][] = [
    [-1, -1, -1, -1, -1],
    [-1, 1, 1, 1, -1],
    [-1, 1, 1, 1, -1],
    [-1, 1, 1, 1, -1],
    [-1, -1, -1, -1, -1]
  ];
  gameCode!: string;
  selectedBalls: number = 0;
  batchCompleted: boolean = false;
  totalRounds: any;
  whiteBallStatus: any;
  currentRound: any;
  balls: any;
  gameId: any;
  show: boolean;
  readyForm = new FormGroup({
    batchNumber: new FormControl('', [Validators.required]),
  });
  JSON = JSON;

  constructor(private gameService: GameService, private ws: WebSocketService, private  router: Router) {
    this.show = true;
  }


  ngOnInit(): void {
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
    this.batchCompleted = false;
    console.log(this.readyForm.value.batchNumber);
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
    if ( this.readyForm.value.batchNumber == this.selectedBalls) {
      this.batchCompleted = true;
    }
    for (let index1 = 0; index1 < this.ballsArrangement.length; index1++) {
      for (let index2 = 0; index2 < this.ballsArrangement.length; index2++) {
        if (index1 == i && index2 == j) {
          this.ballsArrangement[index1][index2] = 0;
        }
      }
    }
  }

  whiteBall(b: any, s: any) {
    this.selectedBalls = this.selectedBalls - 1;
    if ( this.readyForm.value.batchNumber !== this.selectedBalls) {
      this.batchCompleted = false;
    }
    for (let index1 = 0; index1 < this.ballsArrangement.length; index1++) {
      for (let index2 = 0; index2 < this.ballsArrangement.length; index2++) {
        if (index1 == b && index2 == s) {
          if (index1 == 0 || index2 == 0 || index1 == this.ballsArrangement.length - 1 || index2 == this.ballsArrangement.length - 1) {
            this.ballsArrangement[index1][index2] = -1;
          } else {
            this.ballsArrangement[index1][index2] = 1;
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
          this.ballsArrangement[index1][index2] = 0;

        }
      }
    }
  }

}
