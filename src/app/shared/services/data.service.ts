import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  players: any[]= [];
  constructor() { }

  setData(playerArray: any []){
    this.players.push(playerArray);
  }
  getData(){
   return this.players;
  }
}
