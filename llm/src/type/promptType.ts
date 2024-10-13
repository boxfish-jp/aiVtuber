import type { Prisma } from "@prisma/client";

export interface SystemPromptType extends Prisma.JsonObject {
	system: string;
}

export interface ExamplePromptType extends Prisma.JsonObject {
	examples: {
		input: string;
		output: string;
	}[];
}
