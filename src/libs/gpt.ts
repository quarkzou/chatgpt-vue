import type {ChatMessage} from "@/types";
import {v4 as uuidv4} from "uuid";
import CryptoJS from "crypto-js/x64-core";

function compute_sign(ts: string, uuid: string, token: string) {
    const concat = ts + uuid + token;
    return CryptoJS.SHA1(concat).toString(CryptoJS.enc.Hex)
}

export async function chat(messageList: ChatMessage[], model: string, token: string) {
    try {
        const ts = new Date().getTime().toString();
        const nonce = uuidv4();
        const magic_word = 'qsdf12rtyu907816'
        const sign = compute_sign(ts, nonce, magic_word)
        return await fetch("api/chat", {
            method: "post",
            // signal: AbortSignal.timeout(8000),
            // 开启后到达设定时间会中断流式输出
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "ts": ts,
                "nonce": nonce,
                "sign": sign,
                "token": token,
            },
            body: JSON.stringify({
                model: model,
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

export async function check_key(key: string) {
    try {
        let sha_key = CryptoJS.SHA1(key).toString(CryptoJS.enc.Hex)
        return await fetch("/api/key", {
            method: "post",
            body: JSON.stringify({
                key: sha_key,
            }),
        });
    } catch (error) {
        throw error;
    }
}
