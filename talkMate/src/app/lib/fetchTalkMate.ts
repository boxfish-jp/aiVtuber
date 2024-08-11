import { talkMateEndpoint } from "@/endpoint";

export const fetchTalkMate = async (chatId: string) => {
  const endpoint = `http://${talkMateEndpoint.ip}:${talkMateEndpoint.port}`;
  const endPointUrl = new URL(endpoint);
  endPointUrl.searchParams.append("id", chatId);
  console.log(endPointUrl.toString());
  const response = await fetch(endPointUrl.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
};
