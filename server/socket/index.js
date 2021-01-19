class SocketSingleton {
  constructor() {
    this.a = 1;
    this.socket = socket;
    /* if(SocketSingleton._instance) {
      this.a = 1;
      SocketSingleton._instance = this;
    }
    return SocketSingleton._instance; */
  }

  static getInstance() {
    if (this._instance === undefined) {
      this._instance = new SocketSingleton();
    }
    return this._instance;
  }
}

function heartbeat() {
  this.isAlive = true;
}

const socket = {

  // clients: [],
  clients: {},
  games: {},
  connect: (client) => {
    client.onmessage = (data) => {
      console.log(data.data);
      data = JSON.parse(data.data);
      console.log(data.data);
      switch (data.method) {
        case 'init':
          socket.init(client, data);
          break;
        case 'startGame':
          //  send the message to all the clients that game has started
          //  send gameStarted event to host and ballReceived to the player
          socket.startGame(data.data.gameCode);
          break;
        case 'moveBall':
          socket.moveBall(data.data.gameCode, client);
          break;
        case 'connect':
          client.send(JSON.stringify({
            method: 'ok',
          }));
      }
    };
    client.isAlive = true;
    client.on('pong', heartbeat);
    console.log('First connected');
  },
  init: (client, data) => {
    let userData = data.data;
    socket.clients[userData.userId] = {
      client: {
        client: client
      },
    };
    console.log(socket);
    let payload = {
      method: 'userAdded',
      payload: {
        userId: userData.userId
      }
    };
    client.send(JSON.stringify(payload));
  },
  // Alert everyone in the game that new user has added including host
  // playerAdded: (client, userId, name) => {
  //   console.log('player added', userId);
  //   const data = {
  //     method: 'playerAdded',
  //     payload: {
  //       name: name,
  //       userId: userId
  //     }
  //   };
  //   client.send(JSON.stringify(data));
  // },
  startGame: (gameCode) => {
    if (socket.games[gameCode].players.length !== 0) {
      socket.games[gameCode] = {...socket.games[gameCode], ['ballIndex']: 0}
      const data = {
        method: 'gameStarted',
        payload: {
          userId: socket.games[gameCode].players[0].userId
        }
      };
      const hostClient = socket.getHostByGameCode(gameCode);
      const playersClients = socket.getPlayersByCode(gameCode);
      [hostClient, ...playersClients].forEach(client => {
        client.send(JSON.stringify(data))
      })
    }
  },
  moveBall: (gameCode, client) => {
    if (socket.games[gameCode] !== undefined) {
      const game = socket.games[gameCode];
      let ballIndex = 0
      if (game.ballIndex === game.players.length - 1) {
        socket.games[gameCode].ballIndex = 0;
        ballIndex = 0;
      } else {
        socket.games[gameCode].ballIndex = game.ballIndex + 1
        ballIndex = game.ballIndex + 1
      }
      // Alert the player who moved
      client.send(JSON.stringify({
        method: 'ballMoved',
      }));
      // Alert the player who received
      socket.games[gameCode].players[socket.games[gameCode].ballIndex].client.send(JSON.stringify({
        method: 'ballReceived',
      }));
      // Alert the host
      socket.games[gameCode].host.client.send(JSON.stringify({
        method: 'ballPositionUpdated',
        payload: {
          userId: socket.games[gameCode].players[socket.games[gameCode].ballIndex].userId
        }
      }))
    }
  },
  getHostByGameCode: (gameCode) => {
    if (socket.games[gameCode]) {
      return socket.games[gameCode].host.client;
    }
    return null;
  },
  getPlayersByCode: (gameCode) => {
    if (socket.games[gameCode]) {
      return socket.games[gameCode].players.map(player => player.client);
    }
    return null;
  },
  testSend: () => {
    Object.keys(socket.clients).forEach((key) => {
      socket.clients[key].client.client.send("hello");
    })
  },

  sendMessage: (users, {method,data}) => {
    console.log("Users to send message",users);
    users.forEach(element => {
      if (socket.clients[element] !== undefined) {
        socket.clients[element].client.client.send(JSON.stringify({method,data}));
      }
    });
  },
  removeUsers: (users=[]) => {
    users.forEach(element => {
      if (socket.clients[element] !== undefined) {
        delete socket.clients[element]
      }
    });
  }
}
module.exports = SocketSingleton.getInstance().socket
