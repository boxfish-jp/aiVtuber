import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(".env")


endPoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent/"


def sendGemini(text: str):
    GEMINI_KEY = os.getenv("GEMINI_KEY")
    genai.configure(api_key=GEMINI_KEY)

    gemini_pro = genai.GenerativeModel("gemini-pro")
    # prompt = "以下のお題に対して、話し言葉で少し長めの話を作成してください。" + text
    prompt = text
    response = gemini_pro.generate_content(prompt)
    return response.text
