import os
from abc import ABC, abstractmethod
from lib.loadAIConfig import getAiConfig
from langchain_google_vertexai import ChatVertexAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
config = getAiConfig()


class _LLM(ABC):
    @abstractmethod
    def send(self, text: str, who: str) -> str:
        pass

class LLMController(_LLM):

    _MAXChatStore = config["prompt"]["memory"]["max"]
    _store = {}

    _model = ChatVertexAI(
        model=config["prompt"]["model"]["modelName"],
        max_output_tokens=config["prompt"]["model"]["maxOutputTokens"],
        max_retries=config["prompt"]["model"]["maxRetries"],
    )
    _parser = StrOutputParser()
    _systemTemplate = config["prompt"]["prompt"]["systemPrompt"]

    def _speaker(self, who: str):
        if who == "fugu":
            return "今はふぐおに話しかけられました。"
        elif who == "viewer":
            return "今は視聴者に話しかけられました"
        else:
            return "話題を振ってください。"

    def _getSessionHistory(self, sessionId: str):
        if sessionId not in self._store:
            self._store[sessionId] = ChatMessageHistory()
        return self._store[sessionId]

    def _trimArray(self, array):
        if len(array) > self._MAXChatStore:
            array = array[2:]
        return array

    def _trimStore(self):
        self._store["1"].messages = self._trimArray(self._store["1"].messages)

    def _createPrompt(self, who: str):
        system = self._systemTemplate + self._speaker(who)
        return ChatPromptTemplate.from_messages(
            [
                ("system", system),
                MessagesPlaceholder(variable_name="history"),
                ("user", "{input}"),
            ]
        )

    def send(self, text: str, who: str):
        prompt = self._createPrompt(who)

        runnable = prompt | self._model | self._parser

        runnableWithHistory = RunnableWithMessageHistory(
            runnable,
            self._getSessionHistory,
            input_messages_key="input",
            history_messages_key="history",
        )
        result = ""
        try:
            result = runnableWithHistory.invoke(
                {"name": self._speaker(who), "input": text},
                config={"configurable": {"session_id": "1"}},
            )
        except Exception as e:
            print(f"Error: {e}")  # デバッグ用にエラーを出力
            return str(e)
        if not result:
            print("failed to generate response.")
            result = "聞こえなかった。もう一度言って。"
            self._store["1"].messages[-1].content = result
            self._trimStore()

        return result
