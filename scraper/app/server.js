import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createFile, readFile, updateFile, deleteFile, listFiles } from './file-manager';

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { action, filename, content } = JSON.parse(message.toString());

    switch (action) {
      case 'create':
        createFile(filename, content);
        break;
      case 'read':
        ws.send(JSON.stringify({ action: 'read', content: readFile(filename) }));
        break;
      case 'update':
        updateFile(filename, content);
        break;
      case 'delete':
        deleteFile(filename);
        break;
      case 'list':
        ws.send(JSON.stringify({ action: 'list', files: listFiles() }));
        break;
    }

    // Broadcast changes to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action, filename, content }));
      }
    });
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});