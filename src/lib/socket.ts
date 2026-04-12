import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://xspelling.duckdns.org';

type EventHandler = (...args: any[]) => void;

class SocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    // Disconnect any existing socket first
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    // Re-attach any previously registered listeners
    this.listeners.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket?.on(event, handler);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('[Socket] Cannot emit, not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    this.socket?.on(event, handler);
  }

  off(event: string, handler?: EventHandler) {
    if (handler) {
      this.listeners.get(event)?.delete(handler);
      this.socket?.off(event, handler);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketManager = new SocketManager();
