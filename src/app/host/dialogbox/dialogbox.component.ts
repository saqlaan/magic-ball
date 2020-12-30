import {Component, OnInit, Input} from '@angular/core';
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
  players: any[] = [];
  playerAdded: any [] = [];

  constructor(private gameService: GameService, private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  searchPlayer(text: any) {
    this.text = text.target.value;
    this.gameService.searchPlayer(this.text).subscribe(players => {
      this.players = players as any[];
    });
  }

  addplayer(player: any) {
    this.playerAdded.push(player.firstName);
    this.dataService.setData(player._id);
  }


}
