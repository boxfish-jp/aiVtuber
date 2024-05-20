from flask import Flask, Response, request
import urllib.parse as urlparse
import os
from lib.sendChatBison import sendChatBison

# from lib.sendGemini import sendGemini
from lib.voiceBox import text_2_wav

import scipy.io.wavfile as wav
import sounddevice as sd

# from lib.sendVoiceBoxApi import sendVoiceBoxApi

app = Flask(__name__)


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
        with open(path, "wb") as f:
            f.write(audio)
        fs, data = wav.read(path)
        sd.play(data, fs, device=4)
        os.remove(path)
        return res
        # return Response(audio, mimetype="audio/wav")
    else:
        return "Error"


@app.route("/test2")
def test2():
    print(sd.DeviceList())
    return "OK"


@app.route("/interupt")
def interupt():
    key = request.args.get("key")
    if not key:
        return "No key"
    path = f"./wav/{key}.wav"
    if os.path.exists(path):
        os.remove(path)
    return "OK"


if __name__ == "__main__":
    app.run(debug=True, port=8888, threaded=True, host="192.168.68.110")
