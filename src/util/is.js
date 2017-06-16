/**
 * Created by cgspine on 16/7/14.
 */

import {rword, toString} from "./const";

var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/

var class2type = {}
'Boolean Number String Function Array Date RegExp Object Error'.replace(rword, function (name) {
    class2type['[object ' + name + ']'] = name.toLowerCase()
})

export function type(obj) {
    if (obj == null) {
        return String(obj)
    }
    return typeof obj === 'object' || typeof obj === 'function' ?
        class2type[toString.call(obj)] || 'object' :
        typeof obj
}

export function isFunction(fn) {
    return typeof fn === 'function'
}

export function isWinodow(win) {
    return rwindow.test(toString.call(win))
}

export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]' &&
        Object.getPrototypeOf(obj) === Object.prototype
}

export function isArrayLike(obj) {
    if (obj && typeof obj === 'object') {
        var n = obj.length,
            str = toString.call(obj)
        if (rarraylike.test(str)) {
            return true
        } else if (str === '[object Object]' && n === (n >>> 0)) {
            return true //由于ecma262v5能修改对象属性的enumerable，因此不能用propertyIsEnumerable来判定了
        }
    }
    return false
}

export function isEmptyObject(obj) {
    /* eslint-disable no-unused-vars */
    // See https://github.com/eslint/eslint/issues/6125
    var name;

    for (name in obj) {
        return false;
    }
    return true;
}