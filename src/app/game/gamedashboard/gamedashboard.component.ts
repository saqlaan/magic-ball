import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {AuthService, WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-gamedashboard',
  templateUrl: './gamedashboard.component.html',
  styleUrls: ['./gamedashboard.component.css']
})
export class GamedashboardComponent implements OnInit {

  public game_id!: string ;
  public Players!: Array<object>;

  constructor(private router: Router,  private route: ActivatedRoute,  private authService: AuthService, private ws: WebSocketService) {  }

  ngOnInit(): void {
      const _id = localStorage.getItem('game_id');
      this.game_id = ((_id != null) ? _id : '');

      this.Players = [
        {id: 1, name: 'Player 1'},
        {id: 2, name: 'Player 2'},
        {id: 3, name: 'Player 3'},
        {id: 4, name: 'Player 4 '},
      ];
  }

}
