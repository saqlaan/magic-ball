import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '@app/shared/interfaces/user/message.interface';
import {Token} from '@app/shared/interfaces/user/token.interface';
import {Debugger} from 'inspector';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
  ): Observable<Token> {
    return this.http.post<Token>('/api/user/login', {
      ...user
    });
  }

  public updateUser(
    user: any,
  ): Observable<Message> {
    const headers_object = new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('userToken')
    });
    const token = localStorage.getItem('userToken');
    return this.http.put<Message>('/api/user/update-profile', {
      ...user
    }, {
      headers: headers_object
    });
  }
}
