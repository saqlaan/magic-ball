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

  batchNumber: any
  currentTime: any;
  time: any;
  myTime: any;
  div: any = 0;
  minutes: any;
  radius: any = 0;
  icons: any = false;
  totalOffset: any = 0;
  show: boolean = false;
  swapped: any[] = [];
  unAcceptable: boolean = false;

  constructor(private gameService: GameService, private  router: Router, private ws: WebSocketService) {
  }

  ngAfterViewInit() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(gameCode).subscribe((game) => {
      console.log(game.rounds[game.currentRound - 1].unAcceptable);
      if(game.rounds[game.currentRound - 1].unAcceptable == true){
          this.unAcceptable = true;
      }
      this.game = game;
      if(this.game.currentRound == 1){
        this.show = true;
      }
      this.dataSource = new MatTableDataSource(game.rounds);
      this.dataSource.sort = this.sort;
      this.div = 360 / this.game.players.length;
      this.radius = 100;
      const offsetToParentCenter = this.divView.nativeElement.offsetWidth / 2;
      const offsetToChildCenter = 20;
      this.totalOffset = offsetToParentCenter - offsetToChildCenter;
    });
  }

  endRound() {
    this.gameService.endRound(this.game._id).subscribe((game) => {
      this.router.navigate(['roundresult']);
    });
  }
  getChildTopValue(index: any) {
    const y = (Math.cos((this.div * index) * (Math.PI / 180)) * this.radius);
    return (y + this.totalOffset).toString() + 'px';
  }

  getChildLeftValue(index: any) {
    const x = (Math.sin((this.div * index) * (Math.PI / 180)) * this.radius);
    return (x + this.totalOffset).toString() + 'px';
  }


}
