import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private hasBall: boolean;
  private playerSubject = new Subject<any>();
  private playersList: any = [];
  private ballSubject = new Subject<any>();

  constructor() {
    this.hasBall = false;
  }

  public addPlayers(player: any) {
      this.playersList.push({playerId: player, status: false});
      this.playerSubject.next(this.playersList);
  }

  public ballReceived() {
    this.hasBall = true;
    this.ballSubject.next(this.hasBall);
  }

  public getBallStatus() {
    return this.ballSubject.asObservable();
  }

  public getGamePlayers() {
    return this.playerSubject.asObservable();
  }

  public updateBallPosition(userId: any) {
    this.playersList = this.playersList.map((player: any) => {
      player.status = false;
      return player;
    });
    const index = this.playersList.findIndex( (object: any) =>  object.playerId === userId);
    if (index > -1) {
      this.playersList[index].status = true;
    }
    this.playerSubject.next(this.playersList);
  }



}
