// 提供全局公用方法

// 实现a in list功能
import $ from "jquery";


let g_platform = 0;
const params = get_url_params();
if(params.mobile_platform) {
    g_platform = params.mobile_platform;
}

export function is_ios() {
    return g_platform === 2;
}

export function achieveInList(target, list) {
    var tmpdict = {};
    for (var i in list) {
        tmpdict[list[i]] = list[i];
    }
    return target in tmpdict;
}

/**
 * 判断搜索值是否在对象、数组中
 */
export function inArrayValue(search, array) {
    var isExit = false;
    for (var i in array) {
        if (array[i] + '' === search + '') {
            isExit = true;
            break;
        }
    }
    return isExit;
}

// 统一转成字符串之后进行对比，保证数据类型一致
export const inArray = (search, array) => {
    var isExit = false;
    for (var i in array) {
        if (i + '' === search + '') {
            isExit = true;
            break;
        }
    }
    return isExit;
};

// 封装判断是否是自定义模板
export function isCustomize(target) {
    return target === 2;
}

// 深度比较两个对象
export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let index = 0; index < keys1.length; index++) {
        const val1 = object1[keys1[index]];
        const val2 = object2[keys2[index]];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
            // console.log(val1,val2)
            return false;
        }
    }
    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

// 将版本从整形转换成字符串
export function convert_version_2_str(ver) {
    ver = parseInt(ver);
    if (ver >= 10000) {
        const major_ver = parseInt(ver / 10000);
        const minor_ver = parseInt((ver - (major_ver * 10000)) / 100);
        const patch_ver = ver % 100;

        return 'V' + major_ver + '.' + minor_ver + '.' + patch_ver;
    } else {
        return '';
    }
}

// 判断字符串是否是正整数
export function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export function shallow_copy_obj(from, to) {
    for (const k in to) {
        if (from[k] !== undefined) {
            to[k] = from[k];
        }
    }
}

// 判断是否是合法ip
export function ipCheck(ip){
  var reg=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式     
  if(reg.test(ip)){     
    return RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256;
  }else{
    return false;
  }
}

function add0(m) {
    return m < 10 ? '0' + m : m;
}

export function timestamp_2_date_str(ts) {
    const time = new Date(ts);
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    // let s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
}

export function timestamp_2_date_str2(ts) {
    const time = new Date(ts);
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

export function get_now_date_str() {
    const ts = new Date().getTime();
    return timestamp_2_date_str2(ts);
}

export function forbid_scroll_y() {
    const popup = $('.qui-popup__content_right');
    popup.addClass('forbid-scroll-y');
}

export function resume_scroll_y() {
    const popup = $('.qui-popup__content_right');
    popup.removeClass('forbid-scroll-y');
}

export function get_url_params() {
    const getVars = {};
    const uri = window.location.href.split('?');
    if (uri.length === 2) {
        const vars = uri[1].split('&');
        let tmp = '';
        vars.forEach(function (v) {
            tmp = v.split('=');
            if (tmp.length === 2)
                getVars[tmp[0]] = tmp[1];
        });
    }
    return getVars;
}

export default {
    methods: {
        achieveInList,
        deepEqual,
        isCustomize,
        convert_version_2_str,
        shallow_copy_obj,
        forbid_scroll_y,
        resume_scroll_y,
        get_url_params,
    }
};
