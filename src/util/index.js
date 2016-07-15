/**
 * Created by cgspine on 16/7/9.
 */

import { rword } from './const'

var rcamelize = /[-_]([^-_])/g;
var rhyphenate = /([a-z\d])([A-Z]+)/g;
var rhashcode = /\d\.\d{4}/

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


export function camelize(str) {
    str.replace(rcamelize, function (matched, element) {
        return element.toUpperCase();
    })
}


export function hyphenate(str){
    return str.replace(rhyphenate,'$1-$2').toLowerCase()
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
