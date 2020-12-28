import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '@app/shared/services/game/game.service';
import {WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '@app/shared/services/user/user.service';


@Component({
  selector: 'app-gamesettings',
  templateUrl: './gamesettings.component.html',
  styleUrls: ['./gamesettings.component.css']
})
export class GamesettingsComponent implements OnInit {
  game: any = {};
  name: any;
  userName: any;
  totalGames: any;
  highestScore: any;
  averageScore: any;

  gameSettingFomm = new FormGroup({
    groupName: new FormControl('', [Validators.required]),
    groupSize: new FormControl('', [Validators.required]),
    rounds: new FormControl('', [Validators.required]),
    balls: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    timePerRound: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private gameService: GameService, private ws: WebSocketService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.game.status = false;
    const user = JSON.parse(<string>localStorage.getItem('user'));
    this.userService.getProfile(user.userId).subscribe((data) => {
      this.name = 'usama';
      this.userName = ' uijaz20';
      this.totalGames = 4;
      this.averageScore = 12;
      this.highestScore = 25;

    });
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
      this.game.timePerRound = this.gameSettingFomm.value.timePerRound;
      this.gameService.gameSettings(this.game).subscribe((Game) => {
        console.log(Game);
        localStorage.setItem('gameCode', Game.gameCode);
        this.router.navigate(['/waitingplayers']);
      });
    }
  }

}
