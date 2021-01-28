import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playgame',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.css']
})
export class PlaygameComponent implements OnInit {
  @ViewChild(MatSort)
  sort!: MatSort;
  @Input() game1!: any;


  displayedColumns: string[] = ['currentRound', 'ballsEstimate', 'ballsMade'];
  dataSource: any;
  game: any = {};
  div: any = 0;
  minutes: any;
  radius: any = 0;
  icons: any = false;
  timeKeeper: any;
  show: boolean = false;

  countingResponsible: any = 3;

  constructor(private gameService: GameService, private  router: Router) {

  }

  ngOnInit(): void {
    this.gameService.getGame(this.game1.gameCode).subscribe((game) => {
      if (game.currentRound == 1) {
        this.show = true;
      }
      this.game = game;
      this.timeKeeper = this.game.players.indexOf(game.timeKeeper);
      this.dataSource = new MatTableDataSource(game.rounds);
      this.div = 360 / this.game.players.length;
      this.radius = 100;
      this.dataSource.sort = this.sort;
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


}
