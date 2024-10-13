import type { ExamplePromptType } from "@/type/promptType";
import type { Prompt } from "@prisma/client";

export const parseExamplePrompt = (promptData: Prompt) => {
	if (
		promptData.prompt &&
		typeof promptData.prompt === "object" &&
		"examples" in promptData.prompt
	) {
		const examplePrompt = (promptData.prompt as ExamplePromptType).examples;
		return examplePrompt;
	}
	throw new Error("Invalid prompt data");
};
