import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waitingplayers',
  templateUrl: './waitingplayers.component.html',
  styleUrls: ['./waitingplayers.component.css']
})
export class WaitingplayersComponent implements OnInit {

  gameCode!: string;
  constructor() { }

  ngOnInit(): void {
    this.gameCode = localStorage.getItem('gameCode') as string;
  }

}
