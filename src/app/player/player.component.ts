import { Component, OnInit } from '@angular/core';


import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

import { AuthService } from '@app/shared/services';
import {WebSocketService} from '@app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {


  playerForm = new FormGroup({
    playerName: new FormControl('', [Validators.required]),
  });
  constructor( private router: Router, private authService: AuthService, private ws: WebSocketService) { }

  ngOnInit(): void {

  }

  player(): void {
    let playerName;
    playerName = this.playerForm.value.playerName;
    this.authService.player(playerName).subscribe((player) => {
      console.log(player._id);
      localStorage.setItem('game_id', JSON.stringify(player._id));
      this.router.navigate(['/searchgame']);
    });

  }
}
