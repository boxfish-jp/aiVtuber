import { startServer } from "./server/server";
import { watchVoice } from "./voice/watchVoice";
import { watchComment } from "./comment/watchComment";

watchVoice();
watchComment();
startServer();
