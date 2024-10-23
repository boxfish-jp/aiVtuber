import cheerio from "cheerio";
import { NicoliveClient } from "@kikurage/nicolive-api/node";
import { createChat } from "../message/opeMess";

export const getNiconico = async (userId: string) => {
  const pageText = await fetcher(
    "https://live.nicovideo.jp/watch/user/" + userId
  );
  const nowliveId = await getLiveId(pageText);

  new NicoliveClient({ liveId: nowliveId })
    .on("chat", (chat) => {
      console.log("niconico:", chat.content);
      createChat("viewer", chat.content);
    })
    .on("simpleNotification", (notification) => {})
    .on("changeState", (state) => {
      const nusiCome = state.marque?.display?.operatorComment?.content;
      if (nusiCome) {
        console.log("niconico:", nusiCome);
        createChat("fuguo", nusiCome);
      }
    })
    .connect();
};

const fetcher = async (url: string) => {
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url);
      const page = await response.text();
      return page;
    } catch (e) {
      console.log(e);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Failed to fetch");
};

export const getLiveId = async (pageText: string) => {
  const $ = cheerio.load(pageText);
  const liveUrl = $('meta[property="og:url"]').attr("content");
  if (!liveUrl) {
    throw new Error("liveId not found");
  }
  const liveId = liveUrl.replace("https://live.nicovideo.jp/watch/", "");
  return liveId;
};
