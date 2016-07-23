/**
 * Created by cgspine on 16/7/9.
 */
import { oneObject, escapeRegExp } from './util'

var openTag = "{{"

var closeTag = "}}"

var safeOpenTag, safeCloseTag, rexpr, rexprg, rbind
updateExp()


function updateExp(){
    safeOpenTag = escapeRegExp(openTag)

    safeCloseTag = escapeRegExp(closeTag)

    rexpr = new RegExp(safeOpenTag + '([\\s\\S]*)' + safeCloseTag)

    rexprg = new RegExp(safeOpenTag + '([\\s\\S]*)' + safeCloseTag, 'g')

    rbind = new RegExp(safeOpenTag + '[\\s\\S]*' + safeCloseTag + '|\\bms-|\\bslot\\b')
}



var config = {
    
    debug: true,

    $$skipArray: oneObject('$id,$render,$track,$parent,$element,$watch,$fire,$events,$model,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__,__ob__'),
    
}

Object.defineProperty(config, 'rexpr', {
    value:rexpr,
    writable: false,
    configurable: true,
    enumerable: true
})

Object.defineProperty(config, 'rexprg', {
    value:rexprg,
    writable: false,
    configurable: true,
    enumerable: true
})

Object.defineProperty(config, 'rbind', {
    value:rbind,
    writable: false,
    configurable: true,
    enumerable: true
})

Object.defineProperty(config, 'openTag', {
    get: function () {
        return openTag
    },
    set function (newValue) {
        openTag = newValue
        updateExp()
        
    },
    enumerable: true,
    configurable: true
})

Object.defineProperty(config, 'closeTag', {
    get: function () {
        return closeTag
    },
    set function (newValue) {
        closeTag = newValue
        updateExp()

    },
    enumerable: true,
    configurable: true
})



export default config