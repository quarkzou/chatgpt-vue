import request from '@/config/request';

const api = {
    version: '/version',
    chat: '/chat',
};

export default api;

export function get_version() {
    return request({
        url: api.version,
        method: 'get',
        params: {}
    });
}

export function get_chat() {
    return request({
        url: api.chat,
        method: 'get',
        params: {
        },
    });
}