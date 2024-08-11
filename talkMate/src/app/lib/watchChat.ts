import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { Chat } from ".prisma/client";
import { talkMateEndpoint } from "@/endpoint";

export interface WatchChat {}

export class watchChatFromSocket implements WatchChat {
  private _chats: Chat[] = [];
  private _socket: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(Callback: (newChats: Chat[]) => void) {
    const wsEndpoint = getWsEndpoint();
    if (!wsEndpoint) {
      throw new Error("WS_URL is not set");
    }
    this._socket = io(wsEndpoint, { path: "/socket" });

    this._socket.on("message", (event: string) => {
      const chat = JSON.parse(event) as Chat[];
      const newChats = this.pushChats(chat);
      console.log(chat);
      Callback(this.chats);
    });
  }

  get chats(): Chat[] {
    return this._chats;
  }

  pushChats(chats: Chat[]) {
    this._chats = [...this._chats, ...chats];

    return this._chats;
  }
}

const getWsEndpoint = (): string => {
  return `http://${talkMateEndpoint.ip}:${talkMateEndpoint.port}`;
};
