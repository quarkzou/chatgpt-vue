<template>
  <div class="flex flex-col h-screen">
    <div
        class="flex flex-nowrap fixed w-full items-baseline top-0 px-6 py-4 bg-gray-100"
    >
      <div class="text-2xl font-bold">QGPT</div>
      <div class="ml-4 text-sm text-gray-500">
        Based on OpenAI
      </div>

      <Model @update:selectedModel="handleModelChange" class="ml-8"></Model>

      <div
          class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-white rounded-md"
          @click="resetChat()"
      >
        清空
      </div>

    </div>

    <div class="flex-1 mx-2 mt-20 mb-2" ref="chatListDom">
      <div
          class="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
          v-for="item of messageList.filter((v) => v.role !== 'system')"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold">{{ roleAlias[item.role] }}：</div>
          <Copy class="invisible group-hover:visible" :content="item.content"/>
        </div>
        <div>
          <div
              class="prose text-sm text-slate-600 leading-relaxed"
              v-if="item.content"
              v-html="md.render(item.content)"
          ></div>
          <Loading v-else/>
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 w-full p-6 pb-8 bg-gray-100">
      <div class="flex vcenter">
        <textarea
            ref="question_input"
            class="input"
            placeholder="请输入您的问题..."
            v-model="messageContent"
            @input="adjustHeight"
        />
        <button class="btn" :disabled="isTalking" @click="sendOrSave()">
          发送
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import type {ChatMessage} from "@/types";
import {ref, watch, nextTick, onMounted} from "vue";
import {chat, get_version} from "@/libs/gpt";
import cryptoJS from "crypto-js";
import Loading from "@/components/Loading.vue";
import Copy from "@/components/Copy.vue";
import Model from "@/components/Model.vue";
import {md} from "@/libs/markdown";

const selectedModel = ref('gpt-4o');

const handleModelChange = (model: string) => {
  selectedModel.value = model;
}

let apiKey = "";
let isTalking = ref(false);
let messageContent = ref("");
const chatListDom = ref<HTMLDivElement>();
const question_input = ref<HTMLDivElement>();
const decoder = new TextDecoder("utf-8");
const roleAlias = {user: "我", assistant: "QGPT", system: "System"};
const messageList = ref<ChatMessage[]>([
  {
    role: "assistant",
    content: "我是QGPT，一个由OpenAI训练的大型语言模型，能够回答各种问题和提供信息。有什么可以帮助你的吗？",
  },
]);

onMounted(() => {
});

const sendChatMessage = async (content: string = messageContent.value) => {
  try {
    isTalking.value = true;
    if (messageList.value.length === 2) {
      messageList.value.pop();
    }
    messageList.value.push({role: "user", content});
    clearMessageContent();
    messageList.value.push({role: "assistant", content: ""});

    const {body, status} = await chat(messageList.value, selectedModel.value);
    if (body) {
      const reader = body.getReader();
      await readChatResp(reader, status);
    }
  } catch (error: any) {
    appendLastMessageContent(error);
  } finally {
    isTalking.value = false;
  }
};

const getVersion = async () => {
  try {
    const {body, status} = await get_version();
    if (body) {
      const reader = body.getReader();
      await readStream(reader, status);
    }
  } catch (error: any) {
    appendLastMessageContent(error);
  } finally {
    isTalking.value = false;
  }
};

const resetChat = async () => {
  try {
    messageList.value.splice(1)

  } catch (error: any) {
  } finally {
  }
}


const readChatResp = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    status: number
) => {
  let respContent = "";
  let streamDone = false

  while (!streamDone) {
    const {value, done} = await reader.read();
    streamDone = done
    if (value !== undefined) {
      const decodedText = decoder.decode(value, {stream: true});
      respContent += decodedText
    }
  }

  if (status !== 200) {
    const errMsg = `请求出错了：${respContent}`
    appendLastMessageContent(errMsg)
  } else {
    let jsonResp = JSON.parse(respContent)
    let realResp = jsonResp.choices[0].message.content
    appendLastMessageContent(realResp)
  }

};

const readStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    status: number
) => {
  let partialLine = "";

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const {value, done} = await reader.read();
    if (done) break;

    const decodedText = decoder.decode(value, {stream: true});

    if (status !== 200) {
      const json = JSON.parse(decodedText); // start with "data: "
      const content = json.error.message ?? decodedText;
      appendLastMessageContent(content);
      return;
    }

    const chunk = partialLine + decodedText;
    const newLines = chunk.split(/\r?\n/);

    partialLine = newLines.pop() ?? "";

    for (const line of newLines) {
      if (line.length === 0) continue; // ignore empty message
      if (line.startsWith(":")) continue; // ignore sse comment message
      if (line === "data: [DONE]") return; //

      const json = JSON.parse(line.substring(6)); // start with "data: "
      const content =
          status === 200
              ? json.choices[0].delta.content ?? ""
              : json.error.message;
      appendLastMessageContent(content);
    }
  }
};

const appendLastMessageContent = (content: string) =>
    (messageList.value[messageList.value.length - 1].content += content);

const sendOrSave = () => {
  if (!messageContent.value.length) return;
  sendChatMessage();
};

const getSecretKey = () => "quarksoft";

const saveAPIKey = (apiKey: string) => {
  if (apiKey.slice(0, 3) !== "sk-" || apiKey.length !== 51) {
    alert("API Key 错误，请检查后重新输入！");
    return false;
  }
  const aesAPIKey = cryptoJS.AES.encrypt(apiKey, getSecretKey()).toString();
  localStorage.setItem("apiKey", aesAPIKey);
  return true;
};

const getAPIKey = () => {
  if (apiKey) return apiKey;
  const aesAPIKey = localStorage.getItem("apiKey") ?? "";
  apiKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
      cryptoJS.enc.Utf8
  );
  return apiKey;
};


const clearMessageContent = () => (messageContent.value = "");

const scrollToBottom = () => {
  if (!chatListDom.value) return;
  scrollTo(0, chatListDom.value.scrollHeight);
};

const adjustHeight = () => {
  if (!question_input.value) return;
  console.log(question_input.value.scrollHeight)
  question_input.value.style.height = '40px';
  question_input.value.style.height = Math.max(question_input.value.scrollHeight, 40) + 'px';
};


watch(messageList.value, () => nextTick(() => scrollToBottom()));
</script>

<style scoped>
pre {
  font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica,
  "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB",
  "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN",
  "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti",
  SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
}

textarea.input {
  /* Other styles */
  resize: none;
  overflow: hidden;
  min-height: 40px;
  height: 40px;
}

.vcenter {
  align-items: center;
}

</style>
