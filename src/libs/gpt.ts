import type {ChatMessage} from "@/types";
import {v4 as uuidv4} from "uuid";
import CryptoJS from "crypto-js/x64-core";

function compute_sign(ts: string, uuid: string, token: string) {
    const concat = ts + uuid + token;
    return CryptoJS.SHA1(concat).toString(CryptoJS.enc.Hex)
}

export async function chat(messageList: ChatMessage[]) {
    try {
        const ts = new Date().getTime().toString();
        const nonce = uuidv4();
        const token = 'qsdf12rtyu907816'
        const sign = compute_sign(ts, nonce, token)
        return await fetch("api/chat", {
            method: "post",
            // signal: AbortSignal.timeout(8000),
            // 开启后到达设定时间会中断流式输出
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "ts": ts,
                "nonce": nonce,
                "sign": sign,
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
