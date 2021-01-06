import {Component, OnInit} from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-addready',
  templateUrl: './addready.component.html',
  styleUrls: ['./addready.component.css']
})
export class AddreadyComponent implements OnInit {
  gameCode!: string;
  totalRounds: any;
  currentRound: any;
  gameId: any;
  show: boolean;
  readyForm = new FormGroup({
    batchNumber: new FormControl('', [Validators.required]),
  });

  constructor(private gameService: GameService, private  router: Router) {
    this.show = true;
  }


  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
      this.currentRound = Game.currentRound;
      console.log(this.currentRound);
      if (this.currentRound == 1) {
        this.show = false;
      }
      this.totalRounds = Game.noOfRounds;
      this.gameId = Game._id;
    });
  }

  addReady() {
    if (this.currentRound == 1) {
      this.gameService.addReady(this.gameId, [[1, 2, 3, 4, 5]], '').subscribe((Game) => {
        this.router.navigate(['/addready']);
      });
    } else {
      this.gameService.addReady(this.gameId, [[1, 2, 3, 4, 5]], this.readyForm.value.batchNumber).subscribe((Game) => {
        this.router.navigate(['/addready']);
      });
    }
  }

}
