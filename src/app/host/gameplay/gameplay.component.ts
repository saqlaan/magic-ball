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
  @ViewChild('parentDiv') divView: any;
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['currentRound', 'ballsEstimate', 'ballsMade'];
  dataSource: any;
  game: any;

  constructor(private gameService: GameService, private  router: Router, private ws: WebSocketService) {
  }

  ngAfterViewInit() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      this.game = game;
      this.dataSource = new MatTableDataSource(game.rounds);
      this.dataSource.sort = this.sort;
    });
  }

  endRound() {
    const gameData = {
      totalScore: this.game.rounds[this.game.currentRound - 1].ballsMade + this.game.totalScore,
      round: {
        roundId: this.game.rounds[this.game.currentRound - 1]._id,
        roundData: {
          status: 'end',
        }
      }
    };
    this.gameService.updateRoundConfiguration(this.game._id, gameData).subscribe((game: any) => {
      this.router.navigate(['roundresult']);
    });
  }
}
