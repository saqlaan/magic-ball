import {Component, OnInit,  Input} from '@angular/core';
import {GameService} from '@app/shared/services/game/game.service';
import {DataService} from '@app/shared/services/data.service';
import {GamesettingsComponent} from '@app/host/gamesettings/gamesettings.component';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent implements OnInit {
  text = '';
  players: any [] = [];
  playerAdded: any [] = [];
  counter: any = 0;

  constructor(private gameService: GameService, private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  searchPlayer(text: any) {
    this.text = text.target.value;
    this.gameService.searchPlayer(this.text).subscribe((playerName) => {
      for (let i = 1; i < Object.keys(playerName).length; i++) {
        this.players.push(playerName[i]._id);
      }
    });
  }

  addplayer(player: any) {
    this.playerAdded.push(player);
    this.dataService.setData(player);
  }


}
