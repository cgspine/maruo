/**
 * Created by cgspine on 16/7/14.
 */

import { toJson } from  '../util/data'
import { makeHashCode,hideProperty } from  '../util/index'
import { arrayMethods } from  './array'
import { oneObject } from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)


function def(ob, key, value, enumerable) {
    Object.defineProperty(ob, key, {
        value: value,
        writable:true,
        configurable: true,
        enumerable: !!enumerable
    })
}


export function Observable(definition, options) {
    options = options || {}
    this.id = options.id || ''
    this.spath = options.spath || ''
    this.root = options.root || this
    this.hashCode = options.hashCode || makeHashCode('$')
    this.$events = {}
    if (Array.isArray(definition)) {
        this.__data__ = options.__data__ || [];
        this.observeArray(definition, options)
    } else {
        this.__data__ = options.__data__ || Object.create(null);
        this.$skipArray = {}
        if (definition.$skipArray) {
            this.$skipArray =  oneObject(definition.$skipArray)
            delete definition.$skipArray
        }
        this.observeObject(definition,options)
    }
    def(this.__data__, '__ob__', this);
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
    var key,val, values = {}
    for (key in definition) {
        if(definition.hasOwnProperty(key)){
            val = values[key] = definition[key]
            if (!this.isPropSkip(key, val)) {
                this.makePropAccessor(key)
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

Observable.prototype.observeArray = function (definition, options) {
    this.proxy('length')
    // 劫持数组的方法
    for(var i=0; i<arrayKeys.length; i++){
        var key = arrayKeys[i]
        defArrayMethods(this.__data__, key, arrayMethods[key])
    }
    this.makeArrayAccessor(definition, options)
}


function defArrayMethods(ob, key, val) {
    Object.defineProperty(ob, key, {
        value: function () {
            return val.apply(ob, arguments)
        },
        writable:true,
        configurable: true,
        enumerable: false
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
Observable.prototype.makePropAccessor = function (key) {
   var val = NaN
   var root = this.root
   var sid = this.id + '.' + 'key'
   var spath = this.spath.length>0 ? this.spath + '.' + key : key
   Object.defineProperty(this.__data__, key,{
       get: function () {
           return val.__data__ || val
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
               root.$emit(spath, val, newValue.__data__)
           }else{
               root.$emit(spath, val, newValue)
           }
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
    var i, l, el;

    for(i=0, l= array.length; i<l; i++){
        el = array[i];
        el = this.arrayAdapter(el, i)
        this.__data__[i] = el
    }
}

// 数组插入元素、删除元素等都会使得排序发生变化,因此subscript就会非常不靠谱,所以需要引入hashCode
Observable.prototype.arrayAdapter = function(element) {
    if(element !== null && typeof element === 'object'){
        var hashCode = makeHashCode('$')
        def(element, '__ob__', new Observable(element, {
            id: this.id + '.*',
            spath: this.spath + '.*',
            root: this.root,
            hashCode: hashCode,
            __data__: element
        }))
        return element
    }
    return element
}

Observable.prototype.isPropSkip = function (key, value) {
    // 判定此属性能否转换访问器
    return key.charAt(0) === '$' ||
        this.$skipArray[key] ||
        (typeof value === 'function') ||
        (value && value.nodeName && value.nodeType > 0)
}

    
