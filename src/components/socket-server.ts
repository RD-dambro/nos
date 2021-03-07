import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const socketPort = 3001; 

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }});

const publisher_lookup: {[key: string]: string} = {}
const consumers_lookup: {[key: string]: Socket[]} = {}

io.on("connection", (socket: Socket) => {
  
  socket.on("publisher", (channel: string) => {
    publisher_lookup[socket.id] = channel;
    console.log(publisher_lookup)
  });

  socket.on("consumer", (channel: string) => {
    let consumers = consumers_lookup[channel];
    if(!consumers) consumers_lookup[channel] = []; 
    consumers_lookup[channel].push(socket);
    
  });

  socket.on("message", (arg:any) => {
    // console.log("message: ", arg);
    let consumers = consumers_lookup[publisher_lookup[socket.id]];
    if(consumers) consumers.forEach(s => s.emit("message", arg))
  });
}); 

httpServer.listen( socketPort, () => {
    console.log('socket open at', socketPort);
});

export class SocketServer {
  constructor(){}
}
