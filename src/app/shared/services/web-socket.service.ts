import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket = new WebSocket('ws://localhost:5050');
  private send = (obj: any) => {
    this.ws.send(JSON.stringify(obj));
  };

  constructor() {
    this.ws.onopen = () => {
      console.log('Connection opened!');
    };
    this.ws.onmessage = (data) => {
      console.log(data.data );
    };
  }

  init(type: any, code: any) {
    this.send({
      method: 'init',
      data: {
        userType: type,
        gamecode: code,
        userId: Math.random()
      }
    });
  }
}
