import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Message} from '@app/shared/interfaces/user/message.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private hasBall: boolean;
  private playerSubject = new Subject<any>();
  private playersList: any = [];
  private ballSubject = new Subject<any>();
  private methodStatus: any = {};
  private methodStatusSubject = new Subject<any>();

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
}
