/**
 * Created by cgspine on 16/7/14.
 */

import {
    isFunction,
    isPlainObject
} from '../util/is'

import {
    warn
} from  '../util/log'

import { toJson } from  '../util/data'
import { noop } from  './util/index'

import { 
    oneObject,
    makeHashCode
} from '../util/index'
import config from '../config'

var $$skipArray = config.$$skipArray

function Observable(definition, options) {
    options = options || {}
    options.$skipArray = {}
    if (definition.$skipArray) {
        options.$skipArray =  oneObject(definition.$skipArray)
        delete definition.$skipArray
    }
    var hashcode = makeHashCode('$')
    options.id = options.id || hashcode
    options.hashcode = hashcode

    var values = {}

    this.makeAccessors(definition,options, values)
    this.makePureModelAccessor()



}

Observable.prototype.makeAccessors = function (definition,options,values) {
    var key,val,sid
    options.$skipArray = options.$skipArray || {}
    for (key in definition) {
        if(definition.hasOwnProperty(key)){
            if ($$skipArray[key]) {
                continue
            }
            val = values[key] = definition[key]
            if (!this.isSkip(key, val, options.$skipArray)) {
                sid = options.id + '.' + key
                this.makeAccessor(sid,key)
            }
        }
    }
    for (key in values) {
        if(values.hasOwnProperty(key)){
            //对普通监控属性或访问器属性进行赋值
            this[key] = values[key]
            if (key in options.$skipArray) {
                delete values[key]
            } else {
                values[key] = true
            }
        }
    }
}

Observable.prototype.makePureModelAccessor = function () {
    Object.defineProperty(this, "$model", {
        get:function () {
            return toJson(this)
        },
        set: noop,
        enumerable: false,
        configurable: true
    })
}


Observable.prototype.makeAccessor = function (sid,key) {
    var val = NaN
   Observable.defineProperty(self,key,{
       get: function () {
           return val
       },
       set: function (newValue) {
           if (val === newValue) {
               return
           }
           val = newValue
       },
       enumerable: true,
       configurable: true
   })
}

Observable.prototype.isSkip = function (key, value, skipArray) {
    // 判定此属性能否转换访问器
    return key.charAt(0) === '$' ||
        skipArray[key] ||
        (typeof value === 'function') ||
        (value && value.nodeName && value.nodeType > 0)
}

    
