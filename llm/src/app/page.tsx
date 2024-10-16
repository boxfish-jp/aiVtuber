import { ChatSection } from "@/components/chatSection";
import { ExamplePromptForm } from "@/components/examplePromptForm";
import { SystemPromptForm } from "@/components/systemPromptForm";

export default function Home() {
	return (
		<main className="flex flex-col gap-8 px-6">
			<section>
				<ChatSection />
			</section>
			<section>
				<SystemPromptForm />
			</section>
			<section>
				<ExamplePromptForm />
			</section>
		</main>
	);
}
