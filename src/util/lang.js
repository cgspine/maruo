/**
 * Created by cgspine on 16/7/23.
 */

import { rword } from './const'
import { isArrayLike } from './is'

var rcamelize = /[-_]([^-_])/g;
var rhyphenate = /([a-z\d])([A-Z]+)/g;
var rhashcode = /\d\.\d{4}/
var rescape = /[-.*+?^${}()|[\]\/\\]/g
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

export function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || []
    }
    var result = {},
        i = 0, n = array.length,
        value = val != void 0 ? val : 1
    for(; i < n; i++){
        result[array[i]] = value
    }
    return result
}

/**
 * Strip quotes from a string
 * @param str
 * @returns {String | false}
 */
export function stripQuotes (str) {
    var a = str.charCodeAt(0)
    var b = str.charCodeAt(str.length - 1)
    return a === b && (a === 0x22 || a === 0x27)
        ? str.slice(1, -1)
        : str
}


export function camelize(str) {
    str.replace(rcamelize, function (matched, element) {
        return element.toUpperCase();
    })
}


export function hyphenate(str){
    return str.replace(rhyphenate,'$1-$2').toLowerCase()
}


export function escapeRegExp(target) {
    //http://stevenlevithan.com/regex/xregexp/
    //将字符串安全格式化为正则表达式的源码
    return (target + '').replace(rescape, '\\$&')
}


//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
export const makeHashCode = typeof performance !== 'undefined' && performance.now ?
    function (prefix) {
        prefix = prefix || 'maruo'
        return (prefix + performance.now()).replace('.', '')
    } :
    function (prefix)   {
        prefix = prefix || 'maruo'
        return String(Math.random() + Math.random()).replace(rhashcode, prefix)
    }

export  const noop = function () {

}()


export function hideProperty(host, name, value) {
    Object.defineProperty(host, name, {
        value: value,
        writable: true,
        enumerable: false,
        configurable: true
    })
}

export function each(obj, fn) {
    if (obj) { //排除null, undefined
        var i = 0
        if (isArrayLike(obj)) {
            for (var n = obj.length; i < n; i++) {
                if (fn(i, obj[i]) === false)
                    break
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                    break
                }
            }
        }
    }
}


export function trim(text) {
    return text == null ? "" :  ( text + "" ).replace( rtrim, "" );
}