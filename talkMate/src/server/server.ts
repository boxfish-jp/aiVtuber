import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { sendAPI } from "./sendAPI";
import { createChat } from "../message/opeMess";
import { talkMateEndpoint } from "../endpoint";
import { serveStatic } from "@hono/node-server/serve-static";
import { initSocketServer } from "./socketServer";

export const startServer = () => {
  const app = new Hono();

  app.get("/", async (c) => {
    const chatId = Number(c.req.query("id"));
    if (!chatId) {
      return c.text("chatId is required", 400);
    }
    const response = await sendAPI(chatId);
    await createChat("ai", response);
    return c.text(response);
  });
  app.use(
    "*",
    serveStatic({
      root: "public",
      onNotFound: (path, c) => {
        console.log(`${path} not found`);
      },
    })
  );

  console.log(
    `webPage is running on  http://${talkMateEndpoint.ip}:${Number(
      talkMateEndpoint.port
    )}/index.html`
  );

  const server = serve({
    fetch: app.fetch,
    hostname: talkMateEndpoint.ip,
    port: Number(talkMateEndpoint.port),
  });

  initSocketServer(server);
};
