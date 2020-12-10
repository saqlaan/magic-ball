const socket = {
  clients: [],
  games: {},
  connect: (client) => {
    client.onmessage = (data) => {
      console.log("Data received:",data.data);
      data = JSON.parse(data.data);
      console.log("Data Converted:",data.data);
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
          socket.moveBall(data.data.gameCode);
          break;
      }
    };
  },

  init: (client, data) => {
    let userData = data.data;
    if(userData.userType === 'host') {
      socket.games[userData.gameCode] = {
        host:{client:client, userId: userData.userId},
        players:[],
      };
    }else if(userData.userType === 'player') {
      socket.games[userData.gameCode]['players'].push({
        client:client,
        userId:userData.userId
      })
      socket.playerAdded(socket.games[userData.gameCode].host.client,userData.userId);
    }
  },

  // Alert everyone in the game that new user has added including host
  playerAdded: (client,user) => {
    console.log('player added',user);
    const data = {
            method:'playerAdded',
            payload:{
              userId: user
            }
          };
    client.send(JSON.stringify(data));
  },
  startGame: (gameCode) => {
    socket.games[gameCode] = {...socket.games[gameCode], ['ballIndex']:0}
    const data = {
      method:'gameStarted',
      payload:{
        userId: socket.games[gameCode].players[0].userId
      }
    };
    const hostClient = socket.getHostByGameCode(gameCode);
    const playersClients = socket.getPlayersByCode(gameCode);
    [hostClient, ...playersClients].forEach(client => {
      client.send(JSON.stringify(data))
    })
  },

  moveBall: (gameCode) => {
    const game = socket.games[gameCode];
    let ballIndex = 0
    if(game.ballIndex === game.players.length - 1) {
      socket.games[gameCode].ballIndex = 0;
      ballIndex = 0;
    }else {
      socket.games[gameCode].ballIndex = game.ballIndex + 1
      ballIndex = game.ballIndex + 1
    }
    // Alert the player
    socket.games[gameCode].players[socket.games[gameCode].ballIndex].client.send(JSON.stringify({
      method:'ballReceived',
    }));
    // Alert the host
    socket.games[gameCode].host.client.send(JSON.stringify({
      method: 'ballPositionUpdated',
      payload: {
        userId : socket.games[gameCode].players[socket.games[gameCode].ballIndex].userId
      }
    }))
  },
  getHostByGameCode: (gameCode) => {
    if(socket.games[gameCode]){
      return  socket.games[gameCode].host.client;
    }
    return null;
  },

  getPlayersByCode: (gameCode) => {
    if(socket.games[gameCode]){
      return socket.games[gameCode].players.map(player => player.client);
    }
    return null;
  }
}
module.exports = socket;
