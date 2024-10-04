import { Hono } from "hono";
import { env } from "hono/adapter";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { examplePromptZodSchema, chatHistoryZodSchema } from "./types";
import { llm } from "./llm";

const app = new Hono();

const zodSchema = z.object({
  system: z.string(),
  examples: examplePromptZodSchema,
  chatHistory: chatHistoryZodSchema,
  input: z.string(),
});

const route = app.post("/", zValidator("json", zodSchema), async (c) => {
  const { GOOGLE_WEB_CREDENTIALS } = env<{ GOOGLE_WEB_CREDENTIALS: string }>(c);
  process.env.GOOGLE_WEB_CREDENTIALS = GOOGLE_WEB_CREDENTIALS.replace(
    /[';]/g,
    ""
  );

  const { system, examples, chatHistory, input } = c.req.valid("json");
  const answer = await llm(system, examples, chatHistory, input);
  return c.text(answer);
});

export default app;
export type AppType = typeof route;
