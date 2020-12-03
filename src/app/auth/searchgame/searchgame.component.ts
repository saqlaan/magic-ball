import { Component, OnInit } from '@angular/core';
import {WebSocketService} from '@app/shared/services';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services';

@Component({
  selector: 'app-searchgame',
  templateUrl: './searchgame.component.html',
  styleUrls: ['./searchgame.component.css']
})
export class SearchgameComponent implements OnInit {


  searchgameForm = new FormGroup({
    gameCode: new FormControl('', [Validators.required]),
   });


  constructor( private router: Router,private authService: AuthService, private ws: WebSocketService) { }

  ngOnInit(): void {
  }

  game(): void{
      const player ="player";
      const code = this.searchgameForm.value.gameCode;
      this.authService.searchgame(code).subscribe((game) => {
        this.ws.init(player, game.Code);
        this.router.navigate(['']);
      });
  }


}
