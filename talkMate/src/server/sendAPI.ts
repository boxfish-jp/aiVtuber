import { getChatHistory } from "../message/opeMess";
import { AiEndpoint } from "../endpoint";

export const sendAPI = async () => {
  const chatHistory = await getChatHistory();
  if (!chatHistory) {
    return `No chatHistory found`;
  }
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(chatHistory),
  };
  try {
    const response = await fetch(AiEndpoint, params);
    if (!response.ok) {
      console.log(`Failed to send message to AI: ${response.statusText}`);
      return response.text();
    }
    return response.text();
  } catch (e) {
    console.log(e);
    return String(e);
  }
};
