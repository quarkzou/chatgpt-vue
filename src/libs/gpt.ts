import type {ChatMessage} from "@/types";

export async function chat(messageList: ChatMessage[]) {
  try {
    return await fetch("api/chat", {
      method: "post",
      // signal: AbortSignal.timeout(8000),
      // 开启后到达设定时间会中断流式输出
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        // stream: true,
        messages: messageList,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function get_version() {
  try {
    return await fetch("/api/version", {
      method: "get",
    });
  } catch (error) {
    throw error;
  }
}
