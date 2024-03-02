import request from '@/config/request';
import {get_url_params} from "./util";

const api = {
    version: '/qnet/getappinfo',
    dict: '/qnet/getindexinfo',
    user_profile: '/qnet/getusernetworkprofile',
    recommended_profile: '/qnet/getrecommendedprofile',
    add_new_profile: '/qnet/updateusernetworkprofile',
    update_profile: '/qnet/updateusernetworkprofile',
    remove_profile: '/qnet/updateusernetworkprofile',
    scene_profile: '/qnet/getsceneprofile',
    areanetwork_info: '/qnet/getareanetworkinfo',
    gloabal_area_info: '/qnet/getforeignareainfo',
    get_guest_login: '/qnet/getguestlogin',
};

export default api;

let g_language = 0;
let g_version = 20000;
let g_platform = 1;
const params = get_url_params();
if (params.language) {
    const lang = params.language.toLowerCase();
    if (lang === 'en-us' || lang === 'en_us' || lang === 'en') {
        g_language = 1;
    }
}
if(params.app_version) {
    g_version = params.app_version;
}
if(params.mobile_platform) {
    g_platform = params.mobile_platform;
}


export function get_app_info() {
    return request({
        url: api.version,
        method: 'get',
        params: {
            app_version: g_version,
            platform: g_platform,
            language: g_language,
        }
    });
}

export function get_dict() {
    return request({
        url: api.dict,
        method: 'get',
        params: {
            language: g_language,
            app_version: g_version,
        },
    });
}

export function get_user_profile(user_id) {
    return request({
        url: api.user_profile,
        method: 'get',
        params: {
            user_id: user_id,
            platform: g_platform,
            app_version: g_version,
        }
    });
}

export function get_recommended_profile() {
    return request({
        url: api.recommended_profile,
        method: 'get',
        params: {
            platform: g_platform,
            language: g_language,
            app_version: g_version,
        }
    });
}

export function add_new_profile(profile, recommended_id = null, globalInfo) {
    return request({
        url: api.add_new_profile,
        method: 'post',
        data: {
            user_id: globalInfo.user.user_id,
            platform: globalInfo.user.mobile_platform,
            operate_type: 1,
            profile_id: profile.profile_id,
            recommended_id: recommended_id,
            mobile_model: globalInfo.user.mobile_model,
            login_channel: globalInfo.user.login_channel,
            type: profile.type,
            name: profile.name,
            loop: profile.loop,
            start_time: profile.start_time,
            profile_desc: profile.profile_desc,
            params: profile.params,
            scene_info: profile.scene_info,
            app_version: g_version,
        }
    });
}

export function update_profile(profile, globalInfo) {
    return request({
        url: api.update_profile,
        method: 'post',
        data: {
            user_id: globalInfo.user.user_id,
            platform: globalInfo.user.mobile_platform,
            operate_type: 2,
            profile_id: profile.profile_id,
            mobile_model: globalInfo.user.mobile_model,
            login_channel: globalInfo.user.login_channel,
            type: profile.type,
            name: profile.name,
            loop: profile.loop,
            start_time: profile.start_time,
            profile_desc: profile.profile_desc,
            params: profile.params,
            scene_info: profile.scene_info,
            app_version: g_version,
        }
    });
}

export function remove_profile(profile_id, globalInfo) {
    return request({
        url: api.remove_profile,
        method: 'post',
        data: {
            user_id: globalInfo.user.user_id,
            platform: globalInfo.user.mobile_platform,
            operate_type: 3,
            profile_id: profile_id,
            mobile_model: globalInfo.user.mobile_model,
            login_channel: globalInfo.user.login_channel,
            app_version: g_version,
        }
    });
}

export function get_scene_profile() {
    return request({
        url: api.scene_profile,
        method: 'get',
        params: {
            platform: g_platform,
            language: g_language,
            app_version: g_version,
        }
    });
}

export function get_area_network_info(areaParam) {
    return request({
        url: api.areanetwork_info,
        method: 'get',
        params: {
            client: areaParam.client,
            server: areaParam.server,
            operator: areaParam.operator,
            network: areaParam.network,
            app_version: g_version,
        }
    });
}

export function get_global_area_info() {
    return request({
        url: api.gloabal_area_info,
        method: 'get',
        params: {
            app_version: g_version,
        }
    });

}

export function get_guest_login() {
    return request({
        url: api.get_guest_login,
        method: 'get',
        params: {
            platform: g_platform,
            app_version: g_version,
        }
    });
}