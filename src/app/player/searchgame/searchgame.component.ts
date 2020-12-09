import { Component, OnInit } from '@angular/core';
import {WebSocketService} from '@app/shared/services';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services';

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


  constructor( private router: Router,  private route: ActivatedRoute,  private authService: AuthService, private ws: WebSocketService) {
      const userId = localStorage.getItem('player_id');
      this.parameterValue = ((userId != null) ? userId : '');
      this.notfound = false;
  }

  ngOnInit(): void {
  }

  game(): void {
      const player = 'player';
      const player_id = this.parameterValue;
      const code = this.searchgameForm.value.gameCode;
      this.authService.searchgame(code, player_id ).subscribe((game) => {
        if (game) {
          this.ws.init(player, code, player_id);
          this.router.navigate(['/playerdashboard']);
        } else {
          this.notfound = true;
        }
      });
  }


}
