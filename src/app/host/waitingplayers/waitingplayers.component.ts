import {Component, OnInit} from '@angular/core';
import {UserService} from '@app/shared/services/user/user.service';
import {Game} from '@app/shared/interfaces/game/game.interface';
import {GameService} from '@app/shared/services';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-waitingplayers',
  templateUrl: './waitingplayers.component.html',
  styleUrls: ['./waitingplayers.component.css']
})
export class WaitingplayersComponent implements OnInit {

  gameCode!: string;
  totalPlayers!: number;
  joinedPlayers!: number;
  gameId!: string;
  game: any;

  constructor(private gameService: GameService,private toast: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.totalPlayers = Game.maxPlayers;
      this.joinedPlayers = Game.players.length;
      this.gameId = Game._id;
      // if(this.totalPlayers === this.joinedPlayers){
      //   this.gameService.startGame(this.gameId).subscribe((Game) => {
      //     this.toast.success('Game is created successfully', 'Game Settings', {
      //       titleClass: 'center',
      //       messageClass: 'center'
      //     });
      //     this.router.navigate(['/waitingplayers']);
      //   });
      // }
    });
  }
  startGame(){
    this.gameService.startGame(this.gameId).subscribe((Game)=>{
      this.router.navigate(['/addplan']);
    })
}


}


