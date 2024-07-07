import os
from dotenv import load_dotenv
import json

# .envファイルのパスを指定して読み込む
load_dotenv(".env")

config = None


def _loadFile():
    global config
    aiConfigPath = os.getenv("AI_CONFIG_PATH")
    if not aiConfigPath:
        raise Exception("AI_CONFIG_PATH is not set in .env file")

    with open(aiConfigPath, encoding="UTF-8") as f:
        config = json.load(f)
        return config


def getAiConfig():
    if not config:
        return _loadFile()
    return config
