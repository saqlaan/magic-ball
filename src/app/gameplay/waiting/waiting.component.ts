import {Component, Input, OnInit} from '@angular/core';
import {GameService, WebSocketService} from '@app/shared/services';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit {
  @Input() game!: any;
  length: any;

  constructor(private gameService: GameService, private ws: WebSocketService, private toast: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.gameService.getGame(this.game.gameCode).subscribe((game) => {
      this.length = game.players.length;
    });
  }

}
