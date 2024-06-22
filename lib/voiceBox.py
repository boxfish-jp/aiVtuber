import requests
import json
import aiohttp
import aiohttp
import json


async def text_2_wav(text, speaker_id=48, max_retry=20, filename="audio.wav"):
    host = "192.168.68.118"
    port = 50021
    params = (
        ("text", text),
        ("speaker", speaker_id),
    )

    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"http://{host}:{port}/audio_query", params=params
        ) as response1:
            print("response1 status code: ", response1.status)
            response1_json = await response1.json()

            headers = {
                "Content-Type": "application/json",
            }

            async with session.post(
                f"http://{host}:{port}/synthesis",
                headers=headers,
                params=params,
                data=json.dumps(response1_json),
            ) as response2:
                if response2.status == 200:
                    # バイナリデータ取り出し
                    data_binary = await response2.read()
                    print("データ作成に成功")
                    return data_binary
                else:
                    return False
