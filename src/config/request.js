import axios from 'axios';
import {VueAxios} from './axios';
import CRC32 from 'crc-32';
// eslint-disable-next-line no-unused-vars
import AES from 'aes-ecb';
import uuid from 'uuid';


var APP_VERSION = 0;
// eslint-disable-next-line no-unused-vars
var LEO_NUM = 'qsdf12rtyu907816';

function set_app_version(app_version) {
    APP_VERSION = app_version;
}

// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: '/api',
    // 请求超时时间
    timeout: 10000,
});

// 异常拦截处理器
const errorHandler = (error) => {
    if (error.response) {
        alert('网络异常, error_code=' + error.response.status + '，请联系QNET团队');
    }
    return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use(config => {
    const ts = new Date().getTime();
    let info = '';
    if (config.method === 'post') {
        // 加20字节的盐
        const salt = uuid.v4().substring(0, 20);
        info = AES.encrypt(LEO_NUM, salt + JSON.stringify(config.data));
        config.data = info;
    }
    config.headers['enc-info'] = create_enc_info_sign(ts, APP_VERSION, info);
    config.headers['app-version'] = APP_VERSION;
    config.headers['ts'] = ts;
    return config;
}, errorHandler);


function create_enc_info_sign(ts, app_version, info) {
    const buf1 = ts + app_version + info;
    const buf2 = ts + info + app_version + "_qnet_sign";

    const crc1 = (CRC32.str(buf1) >>> 0).toString(16);
    const crc2 = (CRC32.str(buf2) >>> 0).toString(16);
    return (crc1 + crc2).toUpperCase();
}

// response interceptor
request.interceptors.response.use((response) => {
    if (response.status !== 200) {
        alert('[' + response.config.url + ':' + response.status.toString() + ']请求失败，请联系QNET团队');
    }
    return response.data;
}, errorHandler);

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, request);
    }
};

export default request;

export {
    installer as VueAxios,
    request as axios,
    set_app_version,
};
