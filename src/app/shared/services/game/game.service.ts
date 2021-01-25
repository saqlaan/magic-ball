import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Game} from '@app/shared/interfaces/game/game.interface';
import {Player} from '@app/shared/interfaces/player/player.interface';
import {PlayerName} from '@app/shared/interfaces/player/playername.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private counter: number;
  private totalPlayerSubject = new Subject<any>();
  private hasBall: boolean;
  private playerSubject = new Subject<any>();
  private userSubject = new Subject<any>();
  public gameSubject = new Subject<any>();
  private playersList: any = [];
  private usersList: any = [];
  private ballSubject = new Subject<any>();
  private methodStatus: any = {};
  private methodStatusSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.hasBall = false;
    this.counter = 0;
  }

  // public addPlayers() {
  //   this.counter = this.counter + 1;
  //   this.totalPlayerSubject.next(this.counter);
  // }

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

  public playerAdded(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public estimateAdded(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public readyAdded(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public planAdded(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public planStarted(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public gameEnded(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public roundStarted(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }
  public roundEnded(userId: any) {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);

  }


  public ballMoved() {
    const gameCode = localStorage.getItem('gameCode') as string;
    this.getGame(gameCode);
  }


  public totalUsers() {
    return this.totalPlayerSubject.asObservable();
  }

  public getBallStatus() {
    return this.ballSubject.asObservable();
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

  public getGame(
    code: string,
  ) {
    this.http.get<Game>('/api/game/get-game/' + code).subscribe(res => {
      this.gameSubject.next(res);
    });
    return this.gameSubject;
  }

  public addplayer(
    playerName: string,
  ): Observable<Player> {
    return this.http.post<Player>('/api/player/addplayer', {
      playerName
    });
  }

  public searchPlayer(
    playerName: string,
  ) {
    const json = JSON.parse(<string>localStorage.getItem('user'));
    const token = json.userToken;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    return this.http.post('/api/user/search-player', {
      playerName
    }, {
      headers: headers_object
    });
  }

  public startGame(
    gameId: string,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/start-game', {
      gameId
    });
  }

  public addPlan(
    gameId: string,
    arrangement: any [],
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/add-plan', {
      gameId,
      arrangement
    });
  }


  public addEstimate(
    game: any
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/add-estimate', {
    ...game
    });
  }


  public addReady(
    gameId: any,
    batchFlow: any,
    ballsWasted: any,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/add-ready', {
      gameId,
      ballsWasted,
      batchFlow
    });
  }

  public startRound(
    gameId: any,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/start-round', {
      gameId,
    });
  }

  public endRound(
    gameId: any,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/end-round', {
      gameId,
    });
  }
  public endGame(
    gameId: any,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/end-game', {
      gameId,
    });
  }
  public addViewer(
    viewerId: any,
    gameCode:any,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/add-viewer', {
      viewerId,
      gameCode
    });
  }
}
