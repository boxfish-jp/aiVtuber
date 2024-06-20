import os
from langchain_google_vertexai import ChatVertexAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"


class LLM:

    __MAXChatStore = 10
    __store = {}

    __model = ChatVertexAI(model="gemini-pro")
    __parser = StrOutputParser()
    __systemTemplate = "あなたはαちゃんという女の子です。現在、ふぐおという人と。もう一人の人の3人で話しています。\n 出力結果は以下のことを守ること。・つらつらと長めの発言はしない。・必ずため口で話すこと。・あなたはポジティブな人間なので、人を傷つけるようなことは言わないこと。・一人称は「私」にすること。\n 今回は、"

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
        result = runnableWithHistory.invoke(
            {"name": self.__speaker(who), "input": text},
            config={"configurable": {"session_id": "1"}},
        )

        self.__trimStore()

        return result
