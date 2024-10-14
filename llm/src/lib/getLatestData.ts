import type { Prompt } from "@prisma/client";
import { prismaClient } from "./getPrisma";

export async function getLatestData(type: number): Promise<Prompt> {
	const getLatestData = await prismaClient.prompt.findFirst({
		where: {
			type: type,
		},
		orderBy: {
			id: "desc",
		},
	});

	if (getLatestData) {
		return getLatestData;
	}
	return {
		id: -1,
		type: type,
		version: 0,
		prompt: "error: no data found",
	};
}
