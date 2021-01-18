import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '@app/shared/interfaces/user/message.interface';
import {Token} from '@app/shared/interfaces/user/token.interface';
import {Debugger} from 'inspector';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '@app/shared/interfaces/user/user.interface';
import {Email} from '@app/shared/interfaces/user/email.interface';
import {ResetToken} from '@app/shared/interfaces/user/resettoke.interface';
import {Profile} from '@app/shared/interfaces/user/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private hasBall: boolean;


  constructor(private http: HttpClient) {
    this.hasBall = false;
  }

  public addUser(
    user: any
  ): Observable<Message> {
    return this.http.post<Message>('/api/user/signup', {
      ...user
    });
  }

  public loginUser(
    user: any
  ): Observable<User> {
    return this.http.post<User>('/api/user/login', {
      ...user
    });
  }
  public logout(
    userId: any
  ): Observable<Message> {
    return this.http.post<Message>('/api/user/logout', {
      userId
    });
  }

  public updateUser(
    user: any,
  ): Observable<Message> {
    const json = JSON.parse(<string>localStorage.getItem('user'));
    const token = json.userToken;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    return this.http.put<Message>('/api/user/update-profile', {
      ...user
    }, {
      headers: headers_object
    });
  }

  public updatePassword(
    user: any,
  ): Observable<Message> {
    const json = JSON.parse(<string>localStorage.getItem('user'));
    console.log(user);
    const token = json.userToken;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    return this.http.put<Message>('/api/user/update-password', {
      ...user
    }, {
      headers: headers_object
    });
  }

  public getProfile(
    userId: any
  ): Observable<Profile> {
    return this.http.post<Profile>('/api/user/get-profile', {
      userId
    });
  }

  public forgotPassword(
    email: string
  ): Observable<ResetToken> {
    return this.http.post<ResetToken>('/api/user/forgot-password', {
      email
    });
  }

  public resetPassword(
    password: string,
    resetPasswordToken: string
  ): Observable<Message> {
    console.log(resetPasswordToken);
    return this.http.post<Message>('/api/user/reset-password', {
      password,
      resetPasswordToken: resetPasswordToken
    });
  }

}
