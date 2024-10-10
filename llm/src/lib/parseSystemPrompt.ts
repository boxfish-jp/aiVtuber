import { Prompt } from "@prisma/client";

export const parseSystemPrompt = (promptData: Prompt) => {
  if (
    promptData.prompt &&
    typeof promptData.prompt === "object" &&
    "system" in promptData.prompt
  ) {
    const systemPrompt = (promptData.prompt as { system: string }).system;
    return systemPrompt;
  } else {
    throw new Error("Invalid prompt data");
  }
};