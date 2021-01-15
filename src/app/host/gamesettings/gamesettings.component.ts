import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '@app/shared/services/game/game.service';
import {WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '@app/shared/services/user/user.service';
import {object} from 'joi';
import {DialogboxComponent} from '@app/host/dialogbox/dialogbox.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {DataService} from '@app/shared/services/data.service';

@Component({
  selector: 'app-gamesettings',
  templateUrl: './gamesettings.component.html',
  styleUrls: ['./gamesettings.component.css']
})
export class GamesettingsComponent implements OnInit {
  game: any = {};
  name: any;
  players: any[] = [];
  userName: any;
  totalGames: any;
  playerObject: any = [];
  highestScore: any;
  averageScore: any;
  message: any;

  // receiveMessage($event){
  //   this.message = $event;
  // }

  @Input() data!: any[];

  gameSettingFomm = new FormGroup({
    groupName: new FormControl('', [Validators.required]),
    groupSize: new FormControl('', [Validators.required]),
    rounds: new FormControl('', [Validators.required]),
    balls: new FormControl('', [Validators.required]),
    timePerRound: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private gameService: GameService, private ws: WebSocketService, private userService: UserService,
              public dialog: MatDialog, private toast: ToastrService, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.gameSettingFomm.setValue({
      groupName: "",
      groupSize: 4,
      rounds: 0,
      balls: 1,
      timePerRound: 1
    });
    this.game.save_metrics = false;
    this.game.access_toolbox = false;
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
      this.players = this.dataService.getData();
      console.log("player =>",this.playerObject);
      for (let counter = 0; counter < this.players.length; counter++) {
        console.log(counter)
        this.playerObject.push({
          id: this.players[counter],
          incrementalId: counter + 1
        });
      }
      this.game.groupName = this.gameSettingFomm.value.groupName;
      this.game.maxPlayers = this.gameSettingFomm.value.groupSize;
      this.game.noOfRounds = this.gameSettingFomm.value.rounds;
      this.game.ballsPerRound = this.gameSettingFomm.value.balls;
      this.game.timePerSecond = this.gameSettingFomm.value.timePerRound;
      this.game.players = this.playerObject;

      this.gameService.gameSettings(this.game).subscribe((Game) => {
        localStorage.setItem('gameCode', Game.gameCode);
        this.toast.success('Game is created successfully', 'Game Settings', {
          titleClass: 'center',
          messageClass: 'center'
        });
        this.router.navigate(['/waitingplayers']);
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
