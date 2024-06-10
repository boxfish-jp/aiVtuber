import os
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_vertexai import ChatVertexAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

model = ChatVertexAI()

parser = StrOutputParser()

systemTemplate = "あなたはαちゃんという女の子です。現在、ふぐおという人と。もう一人の人の3人で話しています。必ずため口で話すこと。あなたはポジティブな人間なので、人を傷つけるようなことは言わないこと。一人称は「私」にすること。"


def sendChatBison(text: str):
    promptTemplate = ChatPromptTemplate.from_messages(
        [("system", systemTemplate), ("user", text)]
    )

    chain = promptTemplate | model | parser
    return chain.invoke({"text": text})
