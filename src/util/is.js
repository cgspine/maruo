/**
 * Created by cgspine on 16/7/14.
 */

import { 
    rword,
    toString
} from './const'

var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/

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

export function isWinodw(win) {
    return rwindow.test(toString.call(win))
}

export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]' && 
        Object.getPrototypeOf(obj) === Object.prototype
}