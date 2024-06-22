from flask import Flask, Response, request
import urllib.parse as urlparse
import os
import time
import requests
import asyncio
import scipy.io.wavfile as wav
import sounddevice as sd

from lib.sendLLM import LLM
from lib.voiceBox import text_2_wav

app = Flask(__name__)
llm = LLM()

blackList = []
audioQueue = []
speakingStatus = False


@app.route("/")
def main():
    param = request.args.get("text")
    key = request.args.get("key")
    who = request.args.get("who")
    if not param:
        return "No text"
    if not key:
        return "No key"
    if not who:
        who = "viewer"
    param = urlparse.unquote(param)
    print("GET: ", param)
    res = llm.send(param, who)
    res.replace("\\n", "")
    print("result:", res)
    sentences = split_text(res)
    print(sentences)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    tasks = []
    for i, sentence in enumerate(sentences):
        addQueue(param, key, res, str(i))
    for i, sentence in enumerate(sentences):
        tasks.append(loop.create_task(makeAudio(sentence, key, str(i))))

    loop.run_until_complete(gatherTasks(tasks))

    while len(audioQueue) > 0:
        while speakingStatus:
            # print("Wait")
            time.sleep(0.1)

        playAudio()
        time.sleep(0.5)
    print("Done")
    return "Completed"


@app.route("/speaking")
def speaking():
    global speakingStatus
    status = request.args.get("speaking")
    if status == "true":
        speakingStatus = True
    else:
        speakingStatus = False
    return "OK"


@app.route("/test2")
def test2():
    print(sd.DeviceList())
    return "OK"


@app.route("/interupt")
def interupt():
    key = request.args.get("key")
    blackList.append(key)
    if not key:
        return "No key"
    path = f"./wav/{key}.wav"
    if os.path.exists(path):
        print("Remove file")
        os.remove(path)
    else:
        sd.stop()
    print("Interupted")
    return "OK"


async def gatherTasks(tasks):
    await asyncio.gather(*tasks)


def split_text(text: str):
    sentences = text.split("。")
    return sentences


def addQueue(param, key, res, num):
    global audioQueue
    path = f"./wav/{key + num}.wav"
    audioQueue.append([path, param, key, res])


async def makeAudio(sentence, key, num):
    global audioQueue
    audio = await text_2_wav(sentence)
    path = f"./wav/{key + num}.wav"
    if audio:
        with open(path, "wb") as f:
            f.write(audio)
        return True
    else:
        return False


def playAudio():
    global audioQueue
    if len(audioQueue) == 0:
        return
    path, param, key, res = audioQueue.pop(0)
    while not os.path.exists(path):
        time.sleep(0.1)
    fs, data = wav.read(path)
    os.remove(path)
    if key in blackList:
        print("Interupted")
    requests.get("http://192.168.68.118:2525?message=" + res)
    print("play")
    sd.play(data, fs, device=4, blocking=True)


if __name__ == "__main__":
    app.run(debug=True, port=8888, threaded=False, host="192.168.68.110")
