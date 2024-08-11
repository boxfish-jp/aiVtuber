import { Server } from "socket.io";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { ServerType } from "@hono/node-server";
import { Server as HttpServer } from "http";

interface SocketServerType {
  broadcast: (message: string) => void;
}

class SocketIoServer implements SocketServerType {
  private io:
    | Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    | undefined;

  constructor(server: ServerType) {
    this.io = new Server(server as HttpServer, {
      path: "/socket",
      serveClient: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  broadcast(message: string): void {
    if (!this.io) {
      console.log("socket server is not initialized");
      return;
    }
    this.io.emit("message", message);
  }
}

let socketServer: SocketServerType | undefined = undefined;

export const initSocketServer = (serve: ServerType): void => {
  socketServer = new SocketIoServer(serve);
};

export const getSocketServer = (): SocketServerType | undefined => {
  return socketServer;
};

export const broadcast = (message: string): void => {
  const socketServer = getSocketServer();
  if (!socketServer) {
    console.log("socket server is not initialized");
    return;
  }
  socketServer.broadcast(message);
};
