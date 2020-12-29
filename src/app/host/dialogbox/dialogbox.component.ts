import {Component, OnInit} from '@angular/core';
import {GameService} from '@app/shared/services/game/game.service';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent implements OnInit {
  text = '';
  player: any [] = [];
  playeradded: any [] = [];
  i: any = 0;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
  }

  sendit(x: any) {
    this.text = x.target.value;
    console.log(this.text);
    this.searchPlayer();
  }

  searchPlayer() {
    this.gameService.searchPlayer(this.text).subscribe((playerName) => {
      for (let i = 1; i < Object.keys(playerName).length; i++) {
        this.player[i - 1] = playerName[i]._id;
      }
    });
  }

  addplayer(player: any) {
      this.playeradded[this.i] = player;
      this.i = this.i + 1;
      localStorage.setItem('playerArray', JSON.stringify(this.playeradded));
  }


}
