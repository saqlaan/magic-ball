import { Component, OnInit } from '@angular/core';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import { GameService } from '@app/shared/services/game/game.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchgame',
  templateUrl: './searchgame.component.html',
  styleUrls: ['./searchgame.component.css']

})
export class SearchgameComponent implements OnInit {

  public parameterValue: string ;
  public notfound: boolean;

  searchgameForm = new FormGroup({
    gameCode: new FormControl('', [Validators.required]),
    playerId: new FormControl('', [Validators.required]),
   });


  constructor( private router: Router,  private route: ActivatedRoute,  private gameService: GameService, private ws: WebSocketService) {
      const userId = localStorage.getItem('id');
      this.parameterValue = ((userId != null) ? userId : '');
      this.notfound = false;
  }

  ngOnInit(): void {
  }

  searchgame(): void {
      const player = 'player';
      const player_id = this.parameterValue;
      const code = this.searchgameForm.value.gameCode;
      this.gameService.searchgame(code, player_id ).subscribe((game) => {
        if (game) {
          this.ws.init(player, code, player_id);
          localStorage.setItem('game_code', code);
          this.router.navigate(['/playerdashboard']);
        } else {
          this.notfound = true;
        }
      });
  }


}
