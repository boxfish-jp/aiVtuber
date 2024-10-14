import { ChatSection } from "@/components/chatSection";
import { SystemPromptForm } from "@/components/systemPromptForm";
import { ExamplePromptForm } from "@/components/examplePromptForm";

export default function Home() {
	return (
		<>
			<ChatSection />
			<SystemPromptForm />
			<ExamplePromptForm />
		</>
	);
}
