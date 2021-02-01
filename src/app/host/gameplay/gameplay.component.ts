import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GameService, WebSocketService} from '@app/shared/services';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})
export class GameplayComponent implements AfterViewInit {
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['currentRound', 'ballsEstimate', 'ballsMade'];
  dataSource: any;
  game: any;

  batchNumber: any;
  currentTime: any;
  time: any;
  myTime: any;
  div: any = 0;
  visibleStatus: boolean = false;
  minutes: any;
  visibleRule: boolean = false;
  radius: any = 0;
  icons: any = false;
  totalOffset: any = 0;
  show: boolean = false;
  swapped: any[] = [];
  unAcceptable: boolean = false;
  messageSuccess = true;
  timer!: number;
  timeLeft!: number;
  interval: any;
  timeInterval: any;

  constructor(private gameService: GameService, private  router: Router, private ws: WebSocketService) {
  }

  ngAfterViewInit() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      this.game = game;
      this.timer = this.game.rounds[game.currentRound - 1].gamePlayEndingTime - Date.now();
      if (this.timer > 0 && this.timer !== 0) {
        this.interval = setTimeout(() => {
          this.endRound();
        }, this.timer);
      }
      this.timeLeft = Math.floor(this.timer/1000 );
      this.timeInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeLeft = 0;
        }
      }, 1000);
      this.messageSuccess = true;
      if (game.rounds[game.currentRound - 1].unAcceptable) {
        this.unAcceptable = true;
      }
      console.log(game.rounds[game.currentRound - 1].moved);
      this.game = game;
      if (this.game.currentRound == 1) {
        this.show = true;
      }
      this.dataSource = new MatTableDataSource(game.rounds);
      this.dataSource.sort = this.sort;
      this.div = 360 / this.game.players.length;
      this.radius = 100;


      setTimeout(() => {
        this.messageSuccess = false;
      }, 3000);
    });
  }

  endRound() {
    clearInterval(this.interval);
    clearInterval(this.timeInterval);
    const gameData = {
      totalScore: this.game.rounds[this.game.currentRound - 1].ballsMade + this.game.totalScore,
      round: {
        roundId: this.game.rounds[this.game.currentRound - 1]._id,
        roundData: {
          status: 'end',
          gamePlayEndingTime: 0,
        }
      }
    };
    this.gameService.updateRoundConfiguration(this.game._id, gameData).subscribe((game: any) => {
      this.router.navigate(['roundresult']);
    });
  }

  getChildTopValue(index: any) {
    const y = (Math.cos((this.div * index) * (Math.PI / 180)) * this.radius);
    return (y).toString() + 'px';
  }

  getChildLeftValue(index: any) {
    const x = (Math.sin((this.div * index) * (Math.PI / 180)) * this.radius);
    return (x).toString() + 'px';
  }

  visible() {
    this.visibleStatus = !this.visibleStatus;
  }

  visibleRules() {
    this.visibleRule = !this.visibleRule;
  }


}
