import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('new_message', (message: Message) => {
      this.messageHandlers.forEach((handler) => handler(message));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinMission(missionId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join_mission', missionId);
    }
  }

  sendMessage(data: {
    missionId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', data);
    }
  }

  markMessagesAsRead(missionId: string, userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('mark_read', { missionId, userId });
    }
  }

  onNewMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: Message) => void) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}

export default new SocketService();
