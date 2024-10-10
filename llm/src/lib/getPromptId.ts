import { Prompt } from "@prisma/client";
import { prismaClient } from "./getPrisma";

export async function getPromptFromId(id: number): Promise<Prompt> {
  const promptData = await prismaClient.prompt.findFirstOrThrow({
    where: {
      id: id,
    },
  });
  return promptData;
}
