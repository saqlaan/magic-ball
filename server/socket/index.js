const socket = {
  clients: [],
  connect: (client) => {
    client.onmessage = (data) => {
      data = JSON.parse(data.data);
      switch (data.method) {
        case 'init': {
          socket.clients.push({
            client: client,
            type: data.userType
          });
        }
      }
      socket.clients.filter((client) => client.type == 'host').forEach((client) => {
        client.client.send(JSON.stringify({
          playerCount: socket.clients.filter((client) => client.type == 'player').length
        }));
      });
    };
  }
}
module.exports = socket;
