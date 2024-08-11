import { FC, useEffect, useState } from "react";
import { Chat } from ".prisma/client";
import { WatchChat, watchChatFromSocket } from "./lib/watchChat";
import { ChatTable } from "./table";
import { fetchTalkMate } from "./lib/fetchTalkMate";

export const App: FC = () => {
  const [chats, setChat] = useState<Chat[]>([]);
  useEffect(() => {
    const watchChat: WatchChat = new watchChatFromSocket((newChats) => {
      setChat(newChats);
    });
  }, []);

  return (
    <div>
      <ChatTable chats={chats} submitCallback={fetchTalkMate} />
    </div>
  );
};
