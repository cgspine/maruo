/**
 * Created by cgspine on 16/7/14.
 */

import { toJson } from  '../util/data'
import { noop,hideProperty } from  '../util/index'
import { arrayMethod } from  './array'
import { oneObject } from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethod)

export function Observable(definition, options) {
    options = options || {}
    this.spath = options.spath || ''
    this.root = options.root || this
    this.$events = {}
    if (Array.isArray(definition)) {
        this.__data__ = [];
        this.observeArray(definition, options)
    } else {
        this.__data__ = Object.create(null);
        this.$skipArray = {}
        if (definition.$skipArray) {
            this.$skipArray =  oneObject(definition.$skipArray)
            delete definition.$skipArray
        }
        this.observeObject(definition,options)
    }
    
}

Observable.prototype.wait = function () {
    this.root.$events.$$wait$$ = true
}


Observable.prototype.$watch = function (expr, callback) {
    if (arguments.length === 2) {
        (this.root.$events[expr] || (this.root.$events[expr] = [])).ensure(callback)
    } else {
        throw '$watch方法参数不对'
    }
}

Observable.prototype.$emit = function (expr, oldVal, newVal) {
    var root = this.root
    var list = root.$events[expr]
    if(list){
        list.forEach(function (callback) {
            callback.call(root,oldVal, newVal)
        })
    }
}

Observable.prototype.observeObject = function (definition,options) {
    var key,val,sid, spath, values = {}
    for (key in definition) {
        if(definition.hasOwnProperty(key)){
            val = values[key] = definition[key]
            if (!this.isPropSkip(key, val)) {
                sid = options.id + '.' + key
                spath = this.spath.length>0 ? this.spath + '.' + key : key
                this.makePropAccessor(sid, spath, key)
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

Observable.prototype.observeArray = function (definition, option) {
    var spath = option.spath || ''
    this.makeLengthAccessor(spath.length ? spath + '.length':'length')
    // 劫持数组的方法
    for(var i=0; i<arrayKeys.length; i++){
        var key = arrayKeys[i]
        defArrayMehtod(this,key, arrayMethod[key])
    }
    
    this.makeArrayAccessor(definition)
}


function defArrayMehtod(ob, key, value) {
    Object.defineProperty(this, key, {
        value: function () {
            value.apply(ob, arguments)
        }
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

/**
 * 属性accessor构造
 * @param sid
 * @param key
 */
Observable.prototype.makePropAccessor = function (sid,spath,key) {
    var val = NaN
    var root = this.root
   Object.defineProperty(this.__data__,key,{
       get: function () {
           return val
       },
       set: function (newValue) {
           if (val === newValue) {
               return
           }
           if (newValue && typeof newValue === 'object') {
               newValue = new Observable(newValue, {
                   id: sid,
                   root: root,
                   spath: spath,
                   oldVm: val
               })
           }
           root.$emit(spath, val, newValue)
           val = newValue
       },
       enumerable: true,
       configurable: true
   })
}

/**
 *
 */
Observable.prototype.makeLengthAccessor = function (spath) {
    var val = 0
    var root = this.root
    Observable.define(this.__data__, 'length', {
        get: function () {
            return val
        },
        set: function (newValue) {
            if (val === newValue) {
                return
            }
            root.$emit(spath, val, newValue)
            val = newValue
        },
        enumerable: true,
        configurable: true
    })
}

/**
 * 函数accessor构造
 * @param key
 * @param val
 */
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

Observable.prototype.makeArrayAccessor = function (array) {
    
}

Observable.prototype.isPropSkip = function (key, value) {
    // 判定此属性能否转换访问器
    return key.charAt(0) === '$' ||
        this.$skipArray[key] ||
        (typeof value === 'function') ||
        (value && value.nodeName && value.nodeType > 0)
}

    
