from flask import Flask, Response, request
import urllib.parse as urlparse
import os
import time
import requests
from lib.sendChatBison import sendChatBison

# from lib.sendGemini import sendGemini
from lib.voiceBox import text_2_wav

import scipy.io.wavfile as wav
import sounddevice as sd

# from lib.sendVoiceBoxApi import sendVoiceBoxApi

app = Flask(__name__)

blackList = []
audioQueue = []
speakingStatus = False


@app.route("/")
def main():
    param = request.args.get("text")
    key = request.args.get("key")
    if not param:
        return "No text"
    if not key:
        return "No key"
    param = urlparse.unquote(param)
    print("GET: ", param)
    res = sendChatBison(param)
    # res = sendGemini(param)
    print(res)
    audio = text_2_wav(res)
    path = f"./wav/{key}.wav"
    if audio:
        while speakingStatus:
            print("Wait")
            time.sleep(0.1)
        with open(path, "wb") as f:
            f.write(audio)
        audioQueue.append([path, param, key, res])
        while len(audioQueue) > 0:
            playAudio()
            time.sleep(0.5)
        return res
        # return Response(audio, mimetype="audio/wav")
    else:
        return "Error"


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


def playAudio():
    global audioQueue
    if len(audioQueue) == 0:
        return
    path, param, key, res = audioQueue.pop(0)
    fs, data = wav.read(path)
    os.remove(path)
    if key in blackList:
        print("Interupted")
    requests.get("http://192.168.68.118:5173/message?message=" + res)
    print("play")
    sd.play(data, fs, device=4)


if __name__ == "__main__":
    app.run(debug=True, port=8888, threaded=True, host="192.168.68.110")
