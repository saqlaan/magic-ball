import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/services';
import {WebSocketService} from '@app/shared/services';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

 gameForm = new FormGroup({
  gameStatus: new FormControl('', [Validators.required]),
 });



  constructor( private router: Router, private authService: AuthService, private ws: WebSocketService) { }

  ngOnInit(): void {

  }
  game(): void{
    let status;
    const host = 'host';
     status = this.gameForm.value.gameStatus;
    this.authService.game(status).subscribe((game) => {
      this.ws.init(host, game.code);
      localStorage.setItem('game_id', game._id);
      this.router.navigate(['/gamedashboard']);
    });
  }

}
