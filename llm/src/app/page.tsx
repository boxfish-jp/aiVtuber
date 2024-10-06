"use client";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble } from "@/components/ui/chat/chat-bubble";
import { ChatBubbleAvatar } from "@/components/ui/chat/chat-bubble";
import { ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { useChat } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      <ChatMessageList>
        {messages.length > 0
          ? messages.map((m) =>
              m.role === "user" ? (
                <ChatBubble variant="sent">
                  <ChatBubbleAvatar fallback="US" />
                  <ChatBubbleMessage variant="sent">
                    {m.content}
                  </ChatBubbleMessage>
                </ChatBubble>
              ) : (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage variant="received">
                    {m.content}
                  </ChatBubbleMessage>
                </ChatBubble>
              )
            )
          : null}
      </ChatMessageList>
      <form
        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        onSubmit={handleSubmit}
      >
        <ChatInput
          placeholder="Type your message here..."
          className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          value={input}
          onChange={handleInputChange}
          aria-placeholder="Type your message here..."
        />
        <div className="flex items-center p-3 pt-0">
          <Button size="sm" className="ml-auto gap-1.5" type="submit">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </>
  );
}
