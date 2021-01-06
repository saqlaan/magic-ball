import { Component, OnInit } from '@angular/core';
import {GameService} from '@app/shared/services';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-addestimate',
  templateUrl: './addestimate.component.html',
  styleUrls: ['./addestimate.component.css']
})
export class AddestimateComponent implements OnInit {
  gameCode: any;
  totalRounds: any;
  currentRound: any;
  gameId: any;
  batchNumber: any;
  estimatedBalls: any;
  estimateForm = new FormGroup({
    estimatedBalls: new FormControl('', [Validators.required]),
  });

  constructor(private gameService: GameService, private  router: Router) { }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
    this.gameService.getGame(this.gameCode).subscribe((Game) => {
          this.currentRound = Game.currentRound;
          this.totalRounds = Game.noOfRounds;
          this.gameId = Game._id;
    });
  }
  addEstimate(){
    this.estimatedBalls=this.estimateForm.value.estimatedBalls
    this.gameService.addEstimate(this.gameId,this.estimatedBalls,this.gameId).subscribe((Game) =>{
      this.router.navigate(['/addready']);
    });
  }


}
