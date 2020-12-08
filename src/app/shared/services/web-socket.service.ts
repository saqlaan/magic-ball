import {Injectable} from '@angular/core';
import {GameService} from '@app/shared/services/game.service';

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
    this.ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.method) {
        case  'playerAdded':
          this.gameService.addPlayers(data.payload.userId);
          break;
        case 'ballReceived':
          this.gameService.ballReceived();
          break;
        case 'ballPositionUpdated':
          this.gameService.updateBallPosition(data.payload.userId);
          //  For host
          //  Update ball for player for host dashboard
          //  {payload:{userId}}
          break;
        case 'gameStarted':
          this.gameService.gameStarted(data.payload.userId);

      }
    };
  }

  init(type: any, code: any, userId: any = Math.random()) {
    this.send({
      method: 'init',
      data: {
        userType: type,
        gameCode: code,
        userId: userId
      }
    });
  }

  moveBall(gameCode: any) {
    // Called move ball button is pressed
    // code: game code
    this.send({
      method: 'moveBall',
      data: null,
    });
  }

  startGame(gameCode: any){
    this.send({
      method: 'startGame',
      data: {
        gameCode: gameCode,
      }
    });
  }
  addPlayer(code: any, userId:any) {
    this.send({
      method: 'init',
      data: {
        userType: 'addPlayer',
        gameCode: code,
        userId: userId
      }
    });
  }
}
