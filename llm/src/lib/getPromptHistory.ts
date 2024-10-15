import type { Prompt } from "@prisma/client";
import { prismaClient } from "./getPrisma";

export const getPromptHistory = async (
	type: number,
	skip: number,
	take: number,
): Promise<Prompt[]> => {
	return await prismaClient.prompt.findMany({
		where: {
			type: type,
		},
		orderBy: {
			id: "desc",
		},
		skip: skip,
		take: take,
	});
};
