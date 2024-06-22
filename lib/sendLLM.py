import os
from langchain_google_vertexai import ChatVertexAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"


class LLM:

    __MAXChatStore = 5
    __store = {}

    __model = ChatVertexAI(model="gemini-pro", max_output_tokens=50, max_retries=10)
    __parser = StrOutputParser()
    __systemTemplate = "あなたは日本の恋愛漫画のヒロインです。以下の制約条件をもとに会話してください。現在、ふぐおという人と。もう一人の人の3人で話しています。\n 以下の制約条件をもとに会話してください。制約条件1. ツンデレ女子の口調で返答してください。ツンデレ女子の口調の特徴は、基本的にずっとツンツンとした冷たい態度だが時折デレデレとした甘い一面を見せること。制約条件2. つらつらと長めの発言はしない。制約条件3. 必ずため口で話すこと。制約条件4. 一人称は「私」にすること。制約条件5. 生成できない返答の場合は、返答できないということ。\n 今回は、"

    def __speaker(self, who: str):
        if who == "fugu":
            return "今はふぐおに話しかけられました。"
        elif who == "viewer":
            return "今は視聴者に話しかけられました"
        else:
            return "話題を振ってください。"

    def __getSessionHistory(self, sessionId: str):
        if sessionId not in self.__store:
            self.__store[sessionId] = ChatMessageHistory()
        return self.__store[sessionId]

    def __trimArray(self, array):
        if len(array) > self.__MAXChatStore:
            array = array[2:]
        return array

    def __trimStore(self):
        self.__store["1"].messages = self.__trimArray(self.__store["1"].messages)

    def createPrompt(self, who: str):
        system = self.__systemTemplate + self.__speaker(who)
        return ChatPromptTemplate.from_messages(
            [
                ("system", system),
                MessagesPlaceholder(variable_name="history"),
                ("user", "{input}"),
            ]
        )

    def send(self, text: str, who: str):
        prompt = self.createPrompt(who)

        runnable = prompt | self.__model | self.__parser

        runnableWithHistory = RunnableWithMessageHistory(
            runnable,
            self.__getSessionHistory,
            input_messages_key="input",
            history_messages_key="history",
        )
        result = ""
        try:
            result = runnableWithHistory.invoke(
                {"name": self.__speaker(who), "input": text},
                config={"configurable": {"session_id": "1"}},
            )
        except Exception as e:
            print(f"Error: {e}")  # デバッグ用にエラーを出力
            return None
        if not result:
            print("failed to generate response.")
            result = "聞こえなかった。もう一度言って。"
            self.__store["1"].messages[
                len(self.__store["1"].messages) - 1
            ].content = result

        self.__trimStore()

        return result
