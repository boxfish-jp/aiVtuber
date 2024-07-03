import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { sendAPI } from "./sendAPI";

export const startServer = () => {
  const app = new Hono();

  app.get("/", async (c) => {
    const who = c.req.query("who");
    if (!who) {
      return c.text("Please provide a who", 400);
    }
    const response = await sendAPI(who);
    return c.text(response || "OK");
  });

  const port = 2529;
  console.log(`Server is running on  localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
};
