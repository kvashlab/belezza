import http from 'http';
import app from './app';
import { initSocket } from './config/socket';

const PORT = process.env.PORT || 3333;

const server = http.createServer(app);

// Inicializa o Socket.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
