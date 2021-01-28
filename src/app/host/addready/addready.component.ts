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
  unacceptable: boolean = false;
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
  unAcceptable(){
        this.unacceptable = !this.unacceptable;
  }
  addReady() {
    const roundData = {
      status: 'playing',
      unAcceptable: this.unacceptable,
      currentBallHolder: this.game.archWizard,
      moved: [],
      wastedBalls: this.getWastedBalls(),
      ...this.getRedGreenPlayers(),
    };
    if (this.game.currentRound > 1) {
      roundData['ballsArrangement'] = this.ballsArrangement;
      roundData['batchFlow'] = this.readyForm.value.batchNumber;
    }
    this.gameService.updateRoundConfiguration(this.game._id, {
      round: {
        roundId: this.game.rounds[this.game.currentRound - 1]._id,
        roundData: roundData,
      }
    }).subscribe(game => {
      this.router.navigate(['/gameplay']);
    });
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

  getRedGreenPlayers () {
    const players = this.game.players.map((player: any) => player.id);
    const redPlayers: any[] = [];
    let greenPlayers: any[];
    const archIndex = players.findIndex((player: any) => player == this.game.archWizard);
    if (archIndex === 0) {
      redPlayers.push(players[1], players[players.length - 1]);
    } else if (archIndex === players.length - 1) {
      redPlayers.push(players[0], players[players.length - 2]);
    } else {
      redPlayers.push(players[archIndex + 1], players[archIndex - 1]);
    }
    greenPlayers = players.filter((item: any) => !redPlayers.includes(item));
    return {redPlayers, greenPlayers};
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
