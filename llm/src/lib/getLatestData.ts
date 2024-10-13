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
	throw new Error("No data found");
}
