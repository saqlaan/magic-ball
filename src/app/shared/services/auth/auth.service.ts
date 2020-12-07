import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';

import { User } from '@app/shared/interfaces';
import { Game } from '@app/shared/interfaces/game.interface';
import {Player} from '@app/shared/interfaces/player.interface';
import { SearchGame } from '@app/shared/interfaces/serachgame.interface';

import { TokenStorage } from './token.storage';

interface AuthResponse {
  token: string;
  user: User;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorage) {}

  signup(
    firstName: string,
    lastName: string,
  ): Observable<User> {
    return this.http
      .post<AuthResponse>('/api/auth/signup', {
        firstName,
        lastName
      })
      .pipe(
        tap(({token, user}) => {
        }),
        pluck('user')
      );
  }
    game(
      status: string,
    ): Observable<Game> {
      return this.http.post<Game>('/api/game/addgame', {
        status
      });

  }
  searchgame(
    code: string,
    player_id: string,
  ): Observable<Game> {
    return this.http.post<Game>('/api/game/searchgame/',{
      code,
      player_id,
    } );
  }

  player(
    playerName: string,
  ): Observable<Player> {
    return this.http.post<Player>('/api/player/addplayer', {
      playerName
    });
  }



}
