import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Message} from '@app/shared/interfaces/user/message.interface';
import {Token} from '@app/shared/interfaces/user/token.interface';

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
    const headers_object = new HttpHeaders();
    headers_object.append('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
    console.log(headers_object);
    const httpOptions = {
      headers: headers_object
    };
    return this.http.put<Message>('/api/user/update-profile', {
      ...user
    }, httpOptions);
  }
}
