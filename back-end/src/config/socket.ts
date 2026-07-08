import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { supabase } from './supabase';
import { prisma } from './prisma';

let io: SocketIOServer;

export function initSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Use async middleware to validate the Supabase JWT token (same strategy as HTTP auth middleware)
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      // Validate with Supabase (matches the HTTP auth middleware)
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return next(new Error('Authentication error: Invalid Supabase token'));
      }

      // Fetch the user from our Prisma DB to get the role and id
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, role: true }
      });

      if (!dbUser) {
        return next(new Error('Authentication error: User not synced in database'));
      }

      (socket as any).user = dbUser;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Internal error'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`[Socket] User connected: ${user.id}`);
    
    // Join a room with the user's ID to send private messages
    socket.join(user.id);

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${user.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
