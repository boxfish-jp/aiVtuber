import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { think, chatHistoryType } from "./LLM/llm";
import { Action, AIAction } from "./action";
import endpoint from "../../endpoint.json";

const app = new Hono();

app.post("/", async (c) => {
  const { data } = await c.req.json<{ data: chatHistoryType }>();
  const llmResponse = await think(data);
  console.log(llmResponse);
  const action: Action = new AIAction(llmResponse);
  await action.speak();
  return c.text(llmResponse);
});

const port = Number(endpoint.AI.port);
const hostname = endpoint.AI.ip;
console.log(`Server is running on http://${hostname}:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname,
});
