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
    // {userId:player,hasBall:false}
      this.playersList.push({playerId: player, status: false});
      this.playerSubject.next(this.playersList);
  }
  public ballReceived() {
    this.hasBall = true;
    this.ballSubject.next(this.hasBall);
  }
  public getballStatus() {
     this.ballSubject.next(this.hasBall);
     return this.ballSubject.asObservable();
  }

  public getGamePlayers() {
    return this.playerSubject.asObservable();
  }

  public updateBallPosition(userId: any) {
  //  filter playerList and update playerList using userId
  //  Set all player statuses false
    this.playersList.forEach( function (item: any) {
      item.staus = false;
    });
    const index = this.playersList.indexof( (object: any) =>  object.playerId === userId);
    this.playersList[index].status = true;
    this.playerSubject.next(this.playersList);
  }
 public gameStarted(userTd: any) {

 }


}
