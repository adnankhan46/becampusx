import { io } from 'socket.io-client';

// Initialize the socket without auto-connecting
export const socket = io("http://localhost:3000", {
   
});