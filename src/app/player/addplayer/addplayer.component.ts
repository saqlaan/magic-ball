import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {GameService} from '@app/shared/services/game/game.service';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-addplayer',
  templateUrl: './addplayer.component.html',
  styleUrls: ['./addplayer.component.css']
})
export class AddplayerComponent implements OnInit {

  playerForm = new FormGroup({
    playerName: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private gameService: GameService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
  }
  addPlayer(): void {
    let playerName;
    playerName = this.playerForm.value.playerName;
    this.gameService.addplayer(playerName).subscribe((player) => {
      console.log(player._id);
      localStorage.setItem('id', player._id);
      localStorage.setItem('name', player.playerName);
      this.router.navigate(['/searchgame']);
    });
  }
}
