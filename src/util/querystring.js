/**
 * Created by cgspine on 16/9/4.
 */
import { isPlainObject, type } from  './is'
import { log } from './log'

const encode = encodeURIComponent,
    decode = decodeURIComponent,
    r20 = /%20/g

export function param(json) {
    if (!isPlainObject(json)) {
       return ''
    }
    var key, val, ret = []
    for (key in json) {
        if (json.hasOwnProperty(key)) {
            val = json[key]
            key = encode(key)
            if (isValidParamValue(val)) {
                ret.push(`${key}=${encode(val + '')}`)
            } else if (Array.isArray(val) && val.length > 0) {
                for (var i = 0, n = val.length; i < n; i++) {
                    if (isValidParamValue(val[i])) {
                       ret.push(`${key}${encode('[]')}=${encode(val[i] + '')}`)
                    }
                }
            }
        }
    }
    return ret.join('&').replace(r20, '+')
}

export function deparam(url) {
    var json = {}
    if (!url || type(url) !== 'string') {
        return json
    }
    url = url.replace(/^[^?=]*\?]/ig, '').split('#')[0]; // remove host and hash
    var pairs = url.split('&'), pair,
        i = 0, len = pairs.length,
        key, val
    for (; i < len; i++) {
        pair = pairs[i].split('=')
        key = decode(pair[0])
        // http://stackoverflow.com/questions/28063750/decodeuricomponent-throwing-an-error-uri-malformed
        // http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3.2
        // The decodeURIComponent function computes a new version of a URI in which each escape sequence and UTF-8
        // encoding of the sort that might be introduced by the encodeURIComponent function
        // is replaced with the character that it represent
        try {
            val = decode(pair[1] || '')
        } catch (e) {
            log(e + 'decodeURIComponent error : ' + pair[1])
            val = pair[1] || ''
        }
        key = key.replace(/\[\]$/, ""); //如果参数名以[]结尾，则当作数组
        var item = json[key];
        if (item === void 0) {
            json[key] = val; //第一次
        } else if (Array.isArray(item)) {
            item.push(val); //第三次或三次以上
        } else {
            json[key] = [item, val]; //第二次,将它转换为数组
        }
    }
    return json
}

function isValidParamValue(val) {
    var t = typeof val; // If the type of val is null, undefined, number, string, boolean, return true.
    return val == null || (t !== 'object' && t !== 'function');
}