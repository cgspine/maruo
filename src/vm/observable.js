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

var $$skipArray = config.$$skipArray

export function Observable(vm,definition, options) {
    this.vm = vm
    vm.__ob__ = this;
    options = options || {}
    options.$skipArray = {}
    if (definition.$skipArray) {
        options.$skipArray =  oneObject(definition.$skipArray)
        delete definition.$skipArray
    }
    var hashcode = makeHashCode('$')
    options.id = options.id || hashcode
    options.hashcode = hashcode

    this.makeAccessors(definition,options)

}

Observable.prototype.hideProperties = function (keys, options) {
    function hasOwnKey(key) {
        return keys[key] === true
    }
    hideProperty(this.vm, 'hasOwnProperty', hasOwnKey)
    hideProperty(this.vm, '$id', options.id)
    hideProperty(this.vm, '$hashcode', options.hashcode)
    hideProperty(this.vm, '$track', Object.keys(keys).sort().join(';;'))
    hideProperty(this.vm, '$element', null)
    hideProperty(this.vm, '$run', this.run.bind(this.vm))
    hideProperty(this.vm, '$wait', this.wait.bind(this.vm))
    hideProperty(this.vm, '$render', 0)
    hideProperty(this.vm, '$events', {})

    var self = this;
    hideProperty(this, '$watch', function () {
        if (arguments.length === 2) {
            return self.watch.apply(self.vm, arguments)
        } else {
            throw '$watch方法参数不对'
        }
    })
    hideProperty(this.vm, '$fire', this.emit.bind(this.vm))

}

Observable.prototype.wait = function () {
    this.vm.$events.$$wait$$ = true
}

Observable.prototype.run = function() {
    var host = this.vm.$events
    delete host.$$wait$$
    if (host.$$dirty$$) {
        delete host.$$dirty$$
        avalon.rerenderStart = new Date
        var id = this.$id
        var dotIndex = id.indexOf('.')
        if (dotIndex > 0) {
            avalon.batch(id.slice(0, dotIndex))
        } else {
            avalon.batch(id)
        }
    }
}

Observable.prototype.watch = function (expr, callback) {

}

Observable.prototype.emit = function (expr, a, b) {
    var list = self.$events[expr]
}

Observable.prototype.makeAccessors = function (definition,options) {
    this.makePureModelAccessor()

    var key,val,sid, values = {}
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
            this.vm[key] = values[key]
            if (key in options.$skipArray) {
                delete values[key]
            } else {
                values[key] = true
            }
        }
    }

    this.hideProperties(values,options)
}

Observable.prototype.makePureModelAccessor = function () {
    Object.defineProperty(this.vm, "$model", {
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
   Object.defineProperty(this.vm,key,{
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

    
