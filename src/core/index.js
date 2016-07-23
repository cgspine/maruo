/**
 * Created by cgspine on 16/7/9.
 */
import { rword } from '../util/const'
import {parseExpr } from '../compiler/parseExpr'

export default function (maruo) {

    /**
     * shadow copy
     * @param dest
     * @param source
     * @returns {*}
     */
    maruo.shadowCopy = function (dest, source) {
        for(var prop in source){
            dest[prop] = source[prop]
        }
        return dest
    }

    /**
     * a empty function
     */
    maruo.noop = function () {
        
    }
    
    
    maruo.rword = rword
    
    maruo.directive = function (name, definition) {
        definition.parse = definition.parse || defaultParse
        return maruo.directives[name] = definition
    }
}

function defaultParse(cur, pre, binding) {
    cur[binding.name] = parseExpr(binding.expr).getter()
}