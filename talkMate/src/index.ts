import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

app.get("/", async (c) => {
  const who = c.req.query("who");
  if (!who) {
    return c.text("Please provide a who", 400);
  }
  const chat = await prisma.chat.findFirst({
    where: {
      who: who,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  return c.json(chat || { message: "No chat found" });
});

app.post("/", async (c) => {
  const who = c.req.query("who") || "huguo";
  const message = c.req.query("message");
  if (!message) {
    return c.text("Please provide a message", 400);
  }
  const chat = await prisma.chat.create({
    data: {
      who: who,
      message: message,
    },
  });
  return c.json(chat);
});

const port = 2529;
console.log(`Server is running on  localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
