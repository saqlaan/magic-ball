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
    this.game.save_metrics = false;
    this.game.access_toolbox = true;
    const user = JSON.parse(<string>localStorage.getItem('user'));
    this.userService.getProfile(user.userId).subscribe((data) => {
      this.name = data.firstName;
      this.userName = data.lastName;


    });
  }

  toggle(event: any) {
    this.game.save_metrics = true;
  }

  toolBox(event: any) {
    this.game.access_toolbox = true;
  }

  gameSettings() {
    {
      this.game.groupName = this.gameSettingFomm.value.groupName;
      this.game.maxPlayers = this.gameSettingFomm.value.groupSize;
      this.game.noOfRounds = this.gameSettingFomm.value.rounds;
      this.game.ballsPerRound = this.gameSettingFomm.value.balls;
      this.game.timePerSecond = this.gameSettingFomm.value.timePerRound;
      this.game.Player = {playerId, localStorage.getItem('playerId')};
        this.gameService.gameSettings(this.game).subscribe((Game) => {
          console.log(Game);
          localStorage.setItem('gameCode', Game.gameCode);
          this.router.navigate(['/waitingplayers']);
        });
    }
  }

  searchPlayer() {
    this.gameService.searchPlayer('usama').subscribe((playerName) => {
      localStorage.setItem('playerId', playerName[1].playerId);
    });
  }

}
