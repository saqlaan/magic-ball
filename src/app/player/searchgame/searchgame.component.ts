import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import {GameService} from '@app/shared/services/game/game.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-searchgame',
  templateUrl: './searchgame.component.html',
  styleUrls: ['./searchgame.component.css']

})
export class SearchgameComponent implements OnInit {

  public parameterValue: string;
  public playername: string;
  public notfound: boolean;
  public error: any;

  searchgameForm = new FormGroup({
    gameCode: new FormControl('', [Validators.required]),
    playerId: new FormControl('', [Validators.required]),
  });


  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService, private ws: WebSocketService) {
    const userId = localStorage.getItem('id');
    this.parameterValue = ((userId != null) ? userId : '');
    const userName = localStorage.getItem('name');
    this.playername = ((userName != null) ? userName : '');
    this.notfound = false;
    this.error = null;
  }

  ngOnInit(): void {
  }

  searchgame(): void {
    const player = 'player';
    const player_id = this.parameterValue;
    const player_name = this.playername;
    const code = this.searchgameForm.value.gameCode;
    this.gameService.searchgame(code, player_id).subscribe((game) => {
      if (game) {
        // this.ws.init(player, code, player_id, player_name);
        this.gameService.getMethodStatus().subscribe(methodStatus => {
          if (methodStatus['addPlayer'] !== undefined && methodStatus['addPlayer'].status) {
            localStorage.setItem('game_code', code);
            this.router.navigate(['/playerdashboard']);
          } else if (methodStatus['addPlayer'] !== undefined && !methodStatus['addPlayer'].status) {
            this.error = methodStatus.addPlayer.msg;
          }
        });
      } else {
        this.error = 'Error! Game not found';
      }
    });
  }


}
