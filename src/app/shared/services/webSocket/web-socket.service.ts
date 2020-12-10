import {Injectable} from '@angular/core';
import {GameService} from '@app/shared/services/game/game.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket = new WebSocket('ws://localhost:5050');
  private send = (obj: any) => {
    this.ws.send(JSON.stringify(obj));
  };

  constructor(private gameService: GameService) {
    this.ws.onopen = () => {
      console.log('Connection opened!');
    };
    this.ws.onerror = (e) => {
      console.log(e);
    };
    this.ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.method) {
        case  'playerAdded':
          this.gameService.addPlayers(data.payload.name, data.payload.userId);
          break;
        case 'ballReceived':
          this.gameService.ballReceived();
          break;
        case 'ballPositionUpdated':
          this.gameService.updateBallPosition(data.payload.userId);
          break;
        case 'gameStarted':
          this.gameService.updateBallPosition(data.payload.userId);
          if (data.payload.userId === localStorage.getItem('id')) {
            this.gameService.ballReceived();
          }

      }
    };
  }

  init(type: any, code: any, userId: any = Math.random(), name: any) {
    this.send({
      method: 'init',
      data: {
        userType: type,
        gameCode: code,
        userId: userId,
        name: name,
      }
    });
  }
  moveBall(gameCode: any) {
    this.send({
      method: 'moveBall',
      data: {
        gameCode: gameCode
      },
    });
  }

  startGame(gameCode: any) {
    this.send({
      method: 'startGame',
      data: {
        gameCode: gameCode,
      }
    });
  }
}
