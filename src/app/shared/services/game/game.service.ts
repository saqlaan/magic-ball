import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Game} from '@app/shared/interfaces/game/game.interface';
import {Player} from '@app/shared/interfaces/player/player.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private hasBall: boolean;
  private playerSubject = new Subject<any>();
  private playersList: any = [];
  private ballSubject = new Subject<any>();
  private methodStatus: any = {};
  private methodStatusSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.hasBall = false;
  }

  public addPlayers(playerId: any, name: any) {
    this.playersList.push({playerId: playerId, status: false, name: name});
    this.playerSubject.next(this.playersList);
  }

  public ballReceived() {
    this.hasBall = true;
    this.ballSubject.next(this.hasBall);
  }

  // public addPlayerfailed() {
  //   this.messageSubject.next(this.errorMessage);
  //   return this.messageSubject.asObservable();
  // }
  // public addPlayerSuccess() {
  //  this.messageSubject.next(this.successMessage);
  //  return this.messageSubject.asObservable();
  // }
  public setMethodStatus(method: any, {status, msg}: any) {
    this.methodStatus[method] = {
      status: status,
      msg: msg
    };
    this.methodStatusSubject.next(this.methodStatus);
  }

  public getMethodStatus() {
    return this.methodStatusSubject.asObservable();
  }


  public ballMoved() {
    this.hasBall = false;
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
    const index = this.playersList.findIndex((object: any) => object.playerId === userId);
    if (index > -1) {
      this.playersList[index].status = true;
    }
    this.playerSubject.next(this.playersList);
  }

  public addgame(
    status: string,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/addgame', {

      status,
    });

  }

  public gameSettings(
    game: any
  ): Observable<Game> {
    console.log(game);
    const json = JSON.parse(<string>localStorage.getItem('user'));
    const token = json.userToken;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    return this.http.post<Game>('/api/game/game-settings', {
      ...game
    }, {
      headers: headers_object
    });

  }

  public searchgame(
    code: string,
    player_id: string,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/searchgame/', {
      code,
      player_id,
    });
  }

  public addplayer(
    playerName: string,
  ): Observable<Player> {
    return this.http.post<Player>('/api/player/addplayer', {
      playerName
    });
  }


}
