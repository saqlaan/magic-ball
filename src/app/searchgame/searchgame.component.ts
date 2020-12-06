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



  searchgameForm = new FormGroup({
    gameCode: new FormControl('', [Validators.required]),
    playerId: new FormControl('', [Validators.required]),
   });


  constructor( private router: Router,  private route: ActivatedRoute,  private authService: AuthService, private ws: WebSocketService) {
      const userId = localStorage.getItem('id');
      this.parameterValue = ((userId != null) ? userId : '');
  }

  ngOnInit(): void {
  }

  game(): void{
      const player = 'player';
      const player_id = this.parameterValue;
      const code = this.searchgameForm.value.gameCode;
      this.authService.searchgame(code, player_id ).subscribe((game) => {
        // this.ws.init(player, game.Code);
        this.router.navigate(['']);
      });
  }


}
