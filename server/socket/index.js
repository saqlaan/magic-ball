const socket = {
  clients: [],
  init: (client, data) => {
    socket.clients.push({
      client: client,
      type: data.data.userType,
      code: data.data.gameCode,
      userId:data.data.userId,
    });
  },

  connect: (client) => {
    client.onmessage = (data) => {
      data = JSON.parse(data.data);
      switch (data.method) {
        case 'init': {
          socket.init(client, data);
          if (data.data.userType === 'player') {
            const hostClient = socket.getHostByGameCode(data.data.gameCode);
            const playersClient = socket.getPlayersByCode(data.data.gameCode);
            if(hostClient !== null) {
              socket.alertPlayerAdded([hostClient,...playersClient],data.data.userId);
            }
          }
        }
      }
    };
  },

  send: (client,data) => {
    client.send(JSON.stringify(data));
  },

  // Alert everyone in the game that new user has added including host
  alertPlayerAdded: (clients=[],user) => {
    const data = {
            method:'playerAdded',
            payload:{
              userId: user
            }
          };
    clients.forEach(client => {
      client.send(JSON.stringify(data))
    })
  },

  // Send new player all old players
  playerInited: (client,gameCode) => {
  //  send previous player
    const players = socket.getPlayersByGameCode(gameCode);
    const data = {
      method: 'initialPlayers',
      payload: {
        player : players
      }
    }
    socket.send(client,data);
  },

  getHostByGameCode: (gameCode) => {
    const client = socket.clients.find((client) => client.code === gameCode && client.type === 'host');
    if(client !== undefined) {
      return client.client;
    }else{
      return null
    }
  },

  getPlayersByCode: (gameCode) => {
    const players = socket.clients.filter((client) => client.code === gameCode && client.type === 'player').map(client => client.client)
    return players;
  }
}
module.exports = socket;
