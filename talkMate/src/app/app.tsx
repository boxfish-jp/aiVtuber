import { FC, useEffect, useState } from "react";
import { Chat } from ".prisma/client";
import { WatchChat, watchChatFromSocket } from "./lib/watchChat";
import { ChatTable } from "./table";

export const App: FC = () => {
  const [chats, setChat] = useState<Chat[]>([]);

  const [elect, setElect] = useState<number>(-1);
  useEffect(() => {
    const watchChat: WatchChat = new watchChatFromSocket((newChats) => {
      setChat(newChats);
    });
  }, []);

  return (
    <div>
      <ChatTable chats={chats} />
    </div>
  );
};
