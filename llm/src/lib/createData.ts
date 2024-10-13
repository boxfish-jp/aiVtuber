import type { ExamplePromptType, SystemPromptType } from "@/type/promptType";
import { prismaClient } from "./getPrisma";

export const createData = async (
	version: number,
	type: number,
	prompt: SystemPromptType | ExamplePromptType,
): Promise<void> => {
	const newData = await prismaClient.prompt.create({
		data: {
			version: version,
			type: type,
			prompt: prompt,
		},
	});
};
