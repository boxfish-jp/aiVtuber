import { z } from "zod";

export const examplePromptZodSchema = z.array(
  z.object({
    input: z.string(),
    output: z.string(),
  })
);

export const chatHistoryZodSchema = z.array(
  z.object({
    human: z.string(),
    AI: z.string(),
  })
);

export type examplePromptType = z.infer<typeof examplePromptZodSchema>;
export type chatHistoryType = z.infer<typeof chatHistoryZodSchema>;
