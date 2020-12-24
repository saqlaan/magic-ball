import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '@app/shared/services/game/game.service';
import {WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-gamesettings',
  templateUrl: './gamesettings.component.html',
  styleUrls: ['./gamesettings.component.css']
})
export class GamesettingsComponent implements OnInit {
  game: any = {};
  gameSettingFomm = new FormGroup({
    groupName: new FormControl('', [Validators.required]),
    groupSize: new FormControl('', [Validators.required]),
    rounds: new FormControl('', [Validators.required]),
    balls: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private gameService: GameService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
    this.game.status = false;
  }

  toggle(event: any) {
    this.game.status = true;
  }

  gameSettings() {
    {
      this.game.groupName = this.gameSettingFomm.value.groupName;
      this.game.groupSize = this.gameSettingFomm.value.groupSize;
      this.game.rounds = this.gameSettingFomm.value.rounds;
      this.game.balls = this.gameSettingFomm.value.balls;
      this.gameService.gameSettings(this.game).subscribe((Game) => {
        console.log(Game);
        localStorage.setItem('gameCode', Game.gameCode);
        this.router.navigate(['/waitingplayers']);
      });
    }
  }

}
