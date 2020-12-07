import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private playerSubject = new Subject<any>();
  private playersList: any = [];
  constructor() { }

  public addPlayers(player: any) {
      console.log('Add player>>', player);
      this.playersList.push(player);
      this.playerSubject.next(this.playersList);
  }

  public getGamePlayers() {
    return this.playerSubject.asObservable();
  }

}
