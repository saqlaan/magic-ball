const socket = {
  clients: [],
  init: (client, data) => {
    socket.clients.push({
      client: client,
      type: data.data.userType
    });
  },
  connect: (client) => {
    client.onmessage = (data) => {
      data = JSON.parse(data.data);
      switch (data.method) {
        case 'init': {
          socket.init(client, data);
        }
      }
    };
  }
}
module.exports = socket;
