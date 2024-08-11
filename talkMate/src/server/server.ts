import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { sendAPI } from "./sendAPI";
import { createChat, makeLatestAsCleared } from "../message/opeMess";
import { talkMateEndpoint } from "../endpoint";
import { serveStatic } from "@hono/node-server/serve-static";
import { initSocketServer } from "./socketServer";

export const startServer = () => {
  const app = new Hono();

  app.get("/", async (c) => {
    const response = await sendAPI();
    await createChat("ai", response);
    return c.text(response);
  });

  app.get("/clear", async (c) => {
    const result = await makeLatestAsCleared();
    return c.text(`cleared: ${result}`);
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
    `Server is running on  http://localhost:${Number(talkMateEndpoint.port)}`
  );

  const server = serve({
    fetch: app.fetch,
    hostname: talkMateEndpoint.ip,
    port: Number(talkMateEndpoint.port),
  });

  initSocketServer(server);
};
