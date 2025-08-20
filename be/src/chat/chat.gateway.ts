/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5500',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): any {
    client.broadcast.emit('typing', data);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected: ', client);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }
}
