import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { think, chatHistoryType } from "./LLM/llm";
import { Action, AIAction } from "./action";
import endpoint from "../../endpoint.json";

const app = new Hono();
let wsClient: any = undefined;

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.post("/", async (c) => {
  const { data } = await c.req.json<{ data: chatHistoryType }>();
  console.log(data);
  const llmResponse = await think(data);
  console.log(llmResponse);
  const action: Action = new AIAction(llmResponse);
  if (wsClient) {
    await action.speak(wsClient.send);
  } else {
    await action.speak();
  }
  wsClient.send(" ");
  return c.text(llmResponse);
});

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen(evt, ws) {
        console.log("Connection opened");
        if (wsClient) {
          wsClient.close();
        }
        wsClient = ws;
      },
      onClose(evt) {
        console.log("Connection closed");
        wsClient = undefined;
      },
    };
  })
);

const port = Number(endpoint.AI.port);
const hostname = endpoint.AI.ip;
console.log(`Server is running on http://${hostname}:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
  hostname,
});

injectWebSocket(server);
