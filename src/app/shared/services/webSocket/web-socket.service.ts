import {Injectable} from '@angular/core';
import {GameService} from '@app/shared/services/game/game.service';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket = new WebSocket(environment.SOCKET_URL);
  private send = (obj: any) => {
    this.ws.send(JSON.stringify(obj));
  };

  constructor(private gameService: GameService) {
    this.ws.onopen = () => {
      console.log('Connection opened!');
      let user = localStorage.getItem('user');
      if (user) {
        user = JSON.parse(<string>localStorage.getItem('user'));
        if (user) {
          this.init(user['userId']);
        }
      }
      // console.log(JSON.parse(localStorage.getItem('user') || ""));
    };
    this.ws.onerror = (e) => {
      console.log(e);
    };
    this.ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.method) {
        case   'playerAddedSuccessfully':
          this.gameService.setMethodStatus('addPlayer', {status: true, msg: ''});
          break;
        case   'playerAddedFailed':
          this.gameService.setMethodStatus('addPlayer', {status: false, msg: 'Failed! Game already started'});
          break;
        // case  'playerAdded':
        //   this.gameService.addPlayers(data.payload.userId);
        //   break;
        case 'ballReceived':
          this.gameService.ballReceived();
          break;
        case 'ballMoved':
          this.gameService.ballMoved();
          break;
        case 'ballPositionUpdated':
          this.gameService.updateBallPosition(data.payload.userId);
          break;
        case 'playerAdded':
          this.gameService.playerAdded(data);
          break;
        case 'gameStarted':
          this.gameService.updateBallPosition(data.payload.userId);
          if (data.payload.userId === localStorage.getItem('id')) {
            this.gameService.ballReceived();
          }

      }
    };
  }

  init(userId: any) {
    this.send({
      method: 'init',
      data: {
        userId: userId
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
