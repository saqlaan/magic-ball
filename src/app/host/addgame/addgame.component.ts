import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/shared/services/game/game.service';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-addgame',
  templateUrl: './addgame.component.html',
  styleUrls: ['./addgame.component.css']
})
export class AddgameComponent implements OnInit {

  gameForm = new FormGroup({
    gameStatus: new FormControl('', [Validators.required]),
  });

  constructor( private router: Router, private gameService: GameService, private ws: WebSocketService) { }

  ngOnInit(): void {
  }

  addgame(): void{
    let status;
    const host = 'host';
    status = this.gameForm.value.gameStatus;
    this.gameService.addgame(status).subscribe((game) => {
      this.ws.init(host, game.gameCode);
      localStorage.setItem('game_code', game.gameCode);
      this.router.navigate(['/gamedashboard']);
    });
  }

}
