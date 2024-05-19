from flask import Flask, Response, request
import urllib.parse as urlparse

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
    if not param:
        return "No text"
    param = urlparse.unquote(param)
    res = sendChatBison(param)
    # res = sendGemini(param)
    print(res)
    audio = text_2_wav(res)
    if audio:
        with open("output.wav", "wb") as f:
            f.write(audio)
        fs, data = wav.read("output.wav")
        sd.play(data, fs, device=4)
        return Response(audio, mimetype="audio/wav")
        # return Response(audio, mimetype="audio/wav")
    else:
        return "Error"


@app.route("/test2")
def test2():
    print(sd.DeviceList())
    return "OK"


if __name__ == "__main__":
    app.run(debug=True, port=8888, threaded=True, host="192.168.68.110")
