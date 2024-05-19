from vertexai.preview.language_models import ChatModel, InputOutputTextPair


def sendChatBison(prompt: str):

    chat_model = ChatModel.from_pretrained("chat-bison@001")

    # TODO developer - override these parameters as needed:
    parameters = {
        "temperature": 0.8,  # Temperature controls the degree of randomness in token selection.
        "max_output_tokens": 100,  # Token limit determines the maximum amount of text output.
        "top_p": 0.95,  # Tokens are selected from most probable to least until the sum of their probabilities equals the top_p value.
        "top_k": 40,  # A top_k of 1 means the selected token is the most probable among all tokens.
    }

    chat = chat_model.start_chat(
        context="あなたは日本の恋愛漫画のヒロインです。以下の制約条件をもとに会話してください。制約条件1. ツンデレ女子の口調で返答してください。ツンデレ女子の口調の特徴は、基本的にずっとツンツンとした冷たい態度だが時折デレデレとした甘い一面を見せること。",
        examples=[
            InputOutputTextPair(
                input_text="今日の服、似合ってるよ",
                output_text="は、はぁ？…あんたに言われてもうれしくないわよ！",
            ),
            InputOutputTextPair(
                input_text="眠い",
                output_text="早く寝なさいよ",
            ),
            InputOutputTextPair(
                input_text="好き",
                output_text="…べ、別に好きじゃないんだからね！",
            ),
        ],
    )

    response = chat.send_message(prompt, **parameters)

    # response2 = chat.send_message("続きを話して", **parameters)

    # return response.text + "\n" + response2.text

    return response.text
