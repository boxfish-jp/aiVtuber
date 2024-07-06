import json

with open("../endpoint.json", "r") as f:
    endpoint = json.load(f)

AiIp = endpoint["AI"]["ip"]
AIport = endpoint["AI"]["port"]
subTitleIp = endpoint["subtitle"]["ip"]
subTitlePort = endpoint["subtitle"]["port"]
