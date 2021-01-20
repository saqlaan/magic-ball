import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {GameService} from '@app/shared/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  gameCode: any;
  status: any;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((game) => {
      this.status = game.rounds[game.currentRound - 1].status;
      console.log(this.status)
    });

  }
}
