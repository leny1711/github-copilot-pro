import express, { Application } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { config } from './config';
import { initializeFirebase } from './config/firebase';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import missionRoutes from './routes/missionRoutes';
import paymentRoutes from './routes/paymentRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import prisma from './config/database';

// Initialize Express app
const app: Application = express();
const server = http.createServer(app);

// Initialize Socket.IO for real-time chat
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join mission room
  socket.on('join_mission', (missionId: string) => {
    socket.join(`mission_${missionId}`);
    console.log(`User ${socket.id} joined mission ${missionId}`);
  });
  
  // Send message
  socket.on('send_message', async (data: {
    missionId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) => {
    try {
      // Save message to database
      const message = await prisma.message.create({
        data: {
          content: data.content,
          missionId: data.missionId,
          senderId: data.senderId,
          receiverId: data.receiverId,
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      
      // Emit message to mission room
      io.to(`mission_${data.missionId}`).emit('new_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
  
  // Mark messages as read
  socket.on('mark_read', async (data: { missionId: string; userId: string }) => {
    try {
      await prisma.message.updateMany({
        where: {
          missionId: data.missionId,
          receiverId: data.userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      
      io.to(`mission_${data.missionId}`).emit('messages_read', {
        userId: data.userId,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize Firebase
try {
  initializeFirebase();
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

// Start server
const PORT = config.port;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.env}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
  
  await prisma.$disconnect();
  process.exit(0);
});
