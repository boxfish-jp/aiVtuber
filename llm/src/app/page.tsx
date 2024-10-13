"use client";

import { ModeToggle } from "@/components/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/ui/chat/chat-bubble";
import { ChatBubbleAvatar } from "@/components/ui/chat/chat-bubble";
import { ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useChat } from "ai/react";
import { CornerDownLeft } from "lucide-react";

export default function Home() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();

	return (
		<>
			<ModeToggle />
			<ChatMessageList>
				{messages.length > 0
					? messages.map((m) =>
							m.role === "user" ? (
								<ChatBubble variant="sent" key={m.id}>
									<ChatBubbleAvatar fallback="US" />
									<ChatBubbleMessage variant="sent">
										{m.content}
									</ChatBubbleMessage>
								</ChatBubble>
							) : (
								<ChatBubble variant="received" key={m.id}>
									<ChatBubbleAvatar fallback="AI" />
									<ChatBubbleMessage variant="received">
										{m.content}
									</ChatBubbleMessage>
								</ChatBubble>
							),
						)
					: null}
			</ChatMessageList>
			<form
				className="relative rounded-lg border bg-background p-1 focus-within:ring-1 focus-within:ring-ring"
				onSubmit={handleSubmit}
			>
				<ChatInput
					placeholder="Type your message here..."
					className="min-h-12 resize-none rounded-lg border-0 bg-background p-3 shadow-none focus-visible:ring-0"
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
