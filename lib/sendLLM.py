import os
from langchain_google_vertexai import ChatVertexAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"


class LLM:

    __model = ChatVertexAI(model="gemini-pro")
    __parser = StrOutputParser()
    __systemTemplate = "あなたはαちゃんという女の子です。現在、ふぐおという人と。もう一人の人の3人で話しています。必ずため口で話すこと。あなたはポジティブな人間なので、人を傷つけるようなことは言わないこと。一人称は「私」にすること。今回は、{name}"

    def __speaker(self, who: str):
        if who == "fugu":
            return "今はふぐおに話しかけられました。"
        elif who == "viewer":
            return "今は視聴者に話しかけられました"
        else:
            return "話題を振ってください。"

    def send(self, text: str, who: str):
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", self.__systemTemplate),
                ("user", "{input}"),
            ]
        )

        chain = prompt | self.__model | self.__parser
        return chain.invoke({"name": self.__speaker(who), "input": text})
