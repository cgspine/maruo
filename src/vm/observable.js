/**
 * Created by cgspine on 16/7/14.
 */

import { toJson } from  '../util/data'
import { noop,hideProperty } from  '../util/index'

import { 
    oneObject,
    makeHashCode
} from '../util/index'
import config from '../config'

export function Observable(definition, options) {
    this.__data__ = Object.create(null);
    options = options || {}
    
    this.$skipArray = {}
    if (definition.$skipArray) {
        this.$skipArray =  oneObject(definition.$skipArray)
        delete definition.$skipArray
    }
    this.$events = {}
   
    this.observe(definition,options)
}

Observable.prototype.wait = function () {
    this.$events.$$wait$$ = true
}


Observable.prototype.$watch = function (expr, callback) {
    if (arguments.length === 2) {
        
    } else {
        throw '$watch方法参数不对'
    }
}

Observable.prototype.$emit = function (expr, a, b) {
    var list = this.$events[expr]
}

Observable.prototype.observe = function (definition,options) {
    var key,val,sid, values = {}
    for (key in definition) {
        if(definition.hasOwnProperty(key)){
            val = values[key] = definition[key]
            if (!this.isPropSkip(key, val)) {
                sid = options.id + '.' + key
                this.makePropAccessor(sid,key)
            } else if(typeof val === 'function') {
                this.makeFuncAccessor(key,val)
            }
        }
    }
    // 赋值与代理
    for (key in values) {
        if(values.hasOwnProperty(key)){
            //对普通监控属性或访问器属性进行赋值
            this.__data__[key] = values[key]
            this.proxy(key)
            if (key in this.$skipArray) {
                delete values[key]
            } else {
                values[key] = true
            }
        }
    }
    // 使得$id不可被枚举
    hideProperty(this.__data__, '$id', options.id)
    
    // 改写hasOwnProperty
    hideProperty(this.__data__, 'hasOwnProperty', function (key) {
        return values[key] === true
    })
}

/**
 * 代理__data__
 * @param key
 */
Observable.prototype.proxy = function (key){
    var self = this
    Object.defineProperty(this, key, {
        get: function () {
            return self.__data__[key]
        },
        set: function (val) {
            self.__data__[key] = val
        },
        enumerable:false,
        configurable:true
    })
}

/**
 * 转换为纯对象
 * @returns {*}
 */
Observable.prototype.$model = function () {
    return toJson(this.__data__)
}


Observable.prototype.makePropAccessor = function (sid,key) {
    var val = NaN
   Object.defineProperty(this.__data__,key,{
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

Observable.prototype.makeFuncAccessor = function (key, val) {
    var self = this
    Object.defineProperty(self,key,{
        value:function () {
            return val.apply(self,arguments)
        },
        writable: true,
        enumerable: true,
        configurable: true
    })
}

Observable.prototype.isPropSkip = function (key, value) {
    // 判定此属性能否转换访问器
    return key.charAt(0) === '$' ||
        this.$skipArray[key] ||
        (typeof value === 'function') ||
        (value && value.nodeName && value.nodeType > 0)
}

    
