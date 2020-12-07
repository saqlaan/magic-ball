import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-playerdashboard',
  templateUrl: './playerdashboard.component.html',
  styleUrls: ['./playerdashboard.component.css']
})
export class PlayerdashboardComponent implements OnInit {

  public Players: Array<Object> = [
    {id: 1, name: 'Player 1'},
    {id: 2, name: 'Player 2'},
    {id: 3, name: 'Player 3'},
    {id: 4, name: 'Player 4 '},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
