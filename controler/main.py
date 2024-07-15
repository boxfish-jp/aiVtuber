import pygame
import requests
from urllib.parse import urlencode
import json

pygame.init()
pygame.joystick.init()
joys = pygame.joystick.Joystick(0)
joys.init()

with open("../endpoint.json", "r") as f:
    endpointJson = json.load(f)

endpoint = (
    "http://"
    + endpointJson["talkMate"]["ip"]
    + ":"
    + str(endpointJson["talkMate"]["port"])
)


def sendRequest(endpoint: str, path: str, param: dict = None):
    if param is None:
        try:
            response = requests.get(endpoint + path)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(e)
            pass
    else:
        try:
            response = requests.get(endpoint + path + "?" + urlencode(param))
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(e)
            pass


def talkToAI() -> None:
    sendRequest(endpoint, "")


def ClearChatHistory() -> None:
    sendRequest(endpoint, "/clear")


if __name__ == "__main__":
    while True:
        eventlist = pygame.event.get()
        if len(eventlist) > 0:
            if eventlist[0].type == pygame.JOYBUTTONDOWN:
                if eventlist[0].button == 1:
                    print("Clear Chat History")
                    ClearChatHistory()
                elif eventlist[0].button == 2:
                    print("Talk to AI")
                    talkToAI()
