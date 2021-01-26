class SocketSingleton {
  constructor() {
    this.a = 1;
    this.socket = socket;
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
  clients: {},
  connect: (client) => {
    client.onmessage = (data) => {
      data = JSON.parse(data.data);
      switch (data.method) {
        case 'init':
          socket.init(client, data);
          break;
        default:
          console.log('No method found');
      }
    };
    client.isAlive = true;
    client.on('pong', heartbeat);
    console.log('First connected');
  },
  init: (client, {data}) => {
    socket.clients[data.userId] = {
        client, createdAt: (new Date()).toUTCString()
    };
    console.log(data);
    socket.actions.addUser([data.userId], null)
  },
  send: (id, payload) => {
    const client = socket.getClient(id);
    if(client && client.isAlive) {
      client.send(JSON.stringify(payload));
    } else {
      console.log(id + ' not exist or not live');
    }
  },
  sendMany: (ids =[], payload) => {
    ids.forEach(id => {
      const client = socket.getClient(id);
      if(client && client.isAlive) {
        client.send(JSON.stringify(payload));
      } else {
        console.log(id + ' not exist or not live');
      }
    })
  },
  getClient: (id) => {
    return socket.clients[id]? socket.clients[id].client : null;
  },
  actions: {
    addUser: (users, data) => {
      const payload = {method: 'userAdded', data};
      socket.sendMany(users, payload);
    },
    addPlayer: (users = []) => {
      const payload = {method: 'playerAdded', data: null};
      socket.sendMany(users, payload);
    },
    startPlan: (users = []) => {
      const payload = {method: 'planStarted', data: null};
      socket.sendMany(users, payload);
    },
    addPlan: (users = []) => {
      const payload = {method: 'planAdded', data: null};
      socket.sendMany(users, payload);
    },
    addEstimate: (users = []) => {
      const payload = {method: 'estimateAdded', data: null};
      socket.sendMany(users, payload);
    },
    addReady: (users = []) => {
      const payload = {method: 'readyAdded', data: null};
      socket.sendMany(users, payload);
    },
    moveBall: (users = []) => {
      const payload = {method: 'ballMoved', data: null};
      socket.sendMany(users, payload);
    },
    receivedBall: (users = []) => {
      const payload = {method: 'ballReceived', data: null};
      socket.sendMany(users, payload);
    },
    startRound: (users = [], ) => {
      const payload = {method: 'roundStarted', data: null};
      socket.sendMany(users, payload);
    },
    endRound: (users = []) => {
      const payload = {method: 'roundEnded', data: null};
      socket.sendMany(users, payload);
    },
    endGame: (users = []) => {
      const payload = {method: 'gameEnded', data: null};
      socket.sendMany(users, payload);
    },
    removeUsers: (users = []) => {
      users.forEach(id => {
        if (socket.clients[id]) {
          delete socket.clients[id]
        }
      });
    }
  }
}
module.exports = SocketSingleton.getInstance().socket
