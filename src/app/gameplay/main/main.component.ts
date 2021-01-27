import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GameService} from '@app/shared/services';
import {ActivatedRoute} from '@angular/router';

import {WebSocketService} from '@app/shared/services';

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
  unacceptable: boolean = false;

  constructor(private gameService: GameService, private route: ActivatedRoute, private ws: WebSocketService) {
  }

  ngOnInit(): void {
    this.gameCode = this.route.snapshot.paramMap.get('gameCode');
    this.viewerId = this.gameCode + '.' + Date.now();
    this.ws.init(this.viewerId);
    localStorage.setItem('gameCode', this.gameCode);
    this.gameService.addViewer(this.viewerId, this.gameCode).subscribe((game) => {
      this.gameService.getGame(this.gameCode).subscribe((game) => {
        this.game = game;
        console.log(game.rounds);
        if (game.completed) {
          this.status = 'gameEnd';
        } else if (game.rounds.length === 0) {
          this.unacceptable = true;
          this.status = 'waiting';
        }else if(game.rounds[game.currentRound - 1].status == 'end'){
          this.status = 'end';
          this.unacceptable = true;
        } else {
          this.status = game.rounds[game.currentRound - 1].status;
        }
      });
    }, error => {
      this.status = 'notFound';
    });

  }
}
