import WebSocket from "ws";
import cheerio from "cheerio";
import { createChat } from "../message/opeMess";

const getWss = async (ChannelId: string) => {
  const url = "https://live2.nicovideo.jp/watch/" + ChannelId;
  const streamPage = await fetcher(url);
  const $ = cheerio.load(streamPage);
  const embeddedData = $("#embedded-data").attr("data-props");
  if (!embeddedData) {
    throw new Error("Failed to get Embedded Data");
  }
  const embeddedDataJson = JSON.parse(embeddedData);
  const wss: string | undefined = embeddedDataJson.site.relive.webSocketUrl;
  return wss;
};

const fetcher = async (url: string) => {
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url);
      const page = await response.text();
      return page;
    } catch (e) {
      console.log(e);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Failed to fetch");
};

export const getNiconico = async (ChannelId: string) => {
  const wss = await getWss(ChannelId);
  if (!wss) {
    throw new Error("Failed to get wss");
  }

  // websocketでセッションに送るメッセージ
  const message_system_1 =
    '{"type":"startWatching","data":{"stream":{"quality":"abr","protocol":"hls","latency":"low","chasePlay":false},"room":{"protocol":"webSocket","commentable":true},"reconnect":false}}';
  const message_system_2 = '{"type":"getAkashic","data":{"chasePlay":False}}';
  // コメントセッションへWebSocket接続するときに必要な情報
  let uri_comment: string;
  let threadID: string;

  let websocket_system: WebSocket;

  //視聴セッションのWebSocket関係の関数
  // 視聴セッションとのWebSocket接続関数の定義
  function connect_WebSocket_system(url_system: string) {
    websocket_system = new WebSocket(url_system, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });
    websocket_system.onopen = function (evt) {
      onOpen_system(evt);
    };
    websocket_system.onclose = function (evt) {
      onClose_system(evt);
    };
    websocket_system.onmessage = function (evt) {
      onMessage_system(evt);
    };
    websocket_system.onerror = function (evt) {
      onError_system(evt);
    };
  }

  // 視聴セッションとのWebSocket接続が開始された時に実行される
  async function onOpen_system(evt: WebSocket.Event) {
    // console.log("CONNECTED TO THE SYSTEM SERVER");
    await doSend_system(message_system_1);
    await doSend_system(message_system_2);
  }

  // 視聴セッションとのWebSocket接続が切断された時に実行される
  function onClose_system(evt: WebSocket.CloseEvent) {
    // console.log("DISCONNECTED FROM THE SYSTEM SERVER");
    // コメントセッションとのWebSocket接続を切る
  }

  let message_comment: string;
  // 視聴セッションとのWebSocket接続中にメッセージを受け取った時に実行される
  async function onMessage_system(evt: WebSocket.MessageEvent) {
    if (typeof evt.data === "string") {
      const is_room = evt.data.indexOf("room");
      const is_ping = evt.data.indexOf("ping");
      //来場者数も取得したいときはis_statistic = evt.data.indexOf("statistic");

      // コメントセッションへ接続するために必要な情報が送られてきたら抽出してWebSocket接続を開始
      if (is_room > 0) {
        // console.log("RESPONSE FROM THE SYSTEM SERVER: " + evt.data);
        // 必要な情報を送られてきたメッセージから抽出
        const evt_data_json = JSON.parse(evt.data);
        uri_comment = evt_data_json.data.messageServer.uri;
        threadID = evt_data_json.data.threadId;
        message_comment =
          '[{"ping":{"content":"rs:0"}},{"ping":{"content":"ps:0"}},{"thread":{"thread":"' +
          threadID +
          '","version":"20061206","user_id":"guest","res_from":-150,"with_global":1,"scores":1,"nicoru":0}},{"ping":{"content":"pf:0"}},{"ping":{"content":"rf:0"}}]';
        // コメントセッションとのWebSocket接続を開始
        connect_WebSocket_comment();
      }

      // pingが送られてきたらpongとkeepseatを送り、視聴権を獲得し続ける
      if (is_ping > 0) {
        await websocket_system.send('{"type":"pong"}');
        await websocket_system.send('{"type":"keepSeat"}');
        // console.log("ping");
      }
    }
  }

  // 視聴セッションとのWebSocket接続中にエラーメッセージを受け取った時に実行される
  function onError_system(evt: WebSocket.ErrorEvent) {
    // console.log("ERROR FROM THE SYSTEM SERVER: " + evt.message);
  }

  // 視聴セッションへメッセージを送るための関数
  async function doSend_system(message: string) {
    // console.log("SENT TO THE SYSTEM SERVER: " + message);
    await websocket_system.send(message);
  }

  let websocket_comment: WebSocket;
  // コメントセッションのWebSocket関係の関数
  // コメントセッションとのWebSocket接続関数の定義
  function connect_WebSocket_comment() {
    websocket_comment = new WebSocket(uri_comment, "niconama", {
      headers: {
        "Sec-WebSocket-Extensions":
          "permessage-deflate; client_max_window_bits",
        "Sec-WebSocket-Protocol": "msg.nicovideo.jp#json",
      },
    });
    websocket_comment.onopen = function (evt) {
      onOpen_comment(evt);
    };
    websocket_comment.onclose = function (evt) {
      onClose_comment(evt);
    };
    websocket_comment.onmessage = function (evt) {
      onMessage_comment(evt);
    };
    websocket_comment.onerror = function (evt) {
      onError_comment(evt);
    };
  }

  // コメントセッションとのWebSocket接続が開始された時に実行される
  function onOpen_comment(evt: WebSocket.Event) {
    // console.log("CONNECTED TO THE COMMENT SERVER");
    doSend_comment(message_comment);
  }

  // コメントセッションとのWebSocket接続が切断された時に実行される
  function onClose_comment(evt: WebSocket.CloseEvent) {
    // console.log("DISCONNECTED FROM THE COMMENT SERVER");
    //変数を初期化し、再読み込み
    getNiconico(ChannelId);
  }

  // コメントセッションとのWebSocket接続中にメッセージを受け取った時に実行される
  async function onMessage_comment(evt: WebSocket.MessageEvent) {
    if (typeof evt.data === "string") {
      //コメント部分のみを抽出
      const comment = JSON.parse(evt.data).chat;
      //コメントを出力
      if (comment) {
        console.log("niconico:", comment.content);
        createChat("viewer", comment.content);
      }
    }

    //console.log(evt.data);
  }

  // コメントセッションとのWebSocket接続中にエラーメッセージを受け取った時に実行される
  function onError_comment(evt: WebSocket.ErrorEvent) {
    // console.log("ERROR FROM THE COMMENT SERVER: " + evt.message);
  }

  // コメントセッションへメッセージを送るための関数
  function doSend_comment(message: string) {
    // console.log("SENT TO THE COMMENT SERVER: " + message);
    websocket_comment.send(message);
  }

  // 視聴セッションとのWebSocket接続開始
  connect_WebSocket_system(wss);
};
