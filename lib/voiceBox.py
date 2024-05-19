import requests
import json


def text_2_wav(text, speaker_id=2, max_retry=20, filename="audio.wav"):
    host = "192.168.68.118"
    port = 50021
    params = (
        ("text", text),
        ("speaker", speaker_id),
    )
    response1 = requests.post(f"http://{host}:{port}/audio_query", params=params)
    print("response1 status code: ", response1.status_code)
    headers = {
        "Content-Type": "application/json",
    }
    response2 = requests.post(
        f"http://{host}:{port}/synthesis",
        headers=headers,
        params=params,
        data=json.dumps(response1.json()),
    )

    if response2.status_code == 200:
        # バイナリデータ取り出し
        data_binary = response2.content
        print("データ作成に成功")

        return data_binary

    else:
        return False
