import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {GameService} from '@app/shared/services';
import {ActivatedRoute} from '@angular/router';

import {WebSocketService} from '@app/shared/services';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  gameCode: any;
  game: any;
  status: any;
  viewerId: any;

  constructor(private gameService: GameService, private route: ActivatedRoute, private ws: WebSocketService,  private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.gameCode = this.route.snapshot.paramMap.get('gameCode');
    this.viewerId = this.gameCode + "."+ Date.now()
    this.ws.init(this.viewerId);
    localStorage.setItem('gameCode', this.gameCode);
    this.gameService.addViewer(this.viewerId).subscribe((game) => {
      this.gameService.getGame(this.gameCode).subscribe((game) => {
        this.game = game;
        if (game.completed == true) {
          this.status = 'gameEnd';
        } else if (game.rounds.length === 0) {
          this.status = 'waiting';
        } else {
          this.status = game.rounds[game.currentRound - 1].status;
        }
      });
    },error => {
      this.status="notFound"
    });

  }
}
